/*
 * FireRed & LeafGreen 3DS web builder: the release's own Python builder
 * (builder/emerald3ds_builder) run in this Web Worker under Pyodide.
 *
 * In: {rom: Uint8Array, name}. Out: {type: "progress", stage, fraction, message},
 * then {type: "done", zip, fileName, note} or {type: "error", message, hint}.
 *
 * The ROM stays in this worker's memory; nothing about it is sent anywhere.
 * The only network requests are this site's own files, Pyodide from jsDelivr
 * and (by the builder) the pinned follower sprites from jsDelivr.
 */
const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";

function post(msg, transfer) { self.postMessage(msg, transfer || []); }
function progress(stage, fraction, message) { post({ type: "progress", stage, fraction, message }); }

self.onmessage = async (ev) => {
  try {
    progress("load", 0.02, "Starting Python in your browser…");
    importScripts(PYODIDE + "pyodide.js");
    const pyodide = await loadPyodide({ indexURL: PYODIDE });
    // The recipe is xz-compressed; Pyodide keeps lzma as a separate package.
    await pyodide.loadPackage("lzma");

    progress("load", 0.05, "Downloading the game program…");
    const response = await fetch("payload/web-payload.zip", { cache: "no-cache" });
    if (!response.ok) throw new Error("The release files could not be downloaded (HTTP " + response.status + ").");
    pyodide.unpackArchive(await response.arrayBuffer(), "zip", { extractDir: "/web" });

    pyodide.FS.mkdirTree("/rom");
    pyodide.FS.mkdirTree("/out");
    pyodide.FS.writeFile("/rom/rom.gba", ev.data.rom);

    pyodide.globals.set("js_progress", (stage, fraction, message) =>
      progress(stage, 0.08 + 0.9 * fraction, message));
    const result = JSON.parse(pyodide.runPython(`
import io, json, sys, zipfile
sys.path.insert(0, "/web/python")
from pathlib import Path
from emerald3ds_builder.web import run_web_build
from emerald3ds_builder.rom import GAMES, load_rom
from emerald3ds_builder.build import Payload

out = json.loads(run_web_build("/rom/rom.gba", "/web/payload", "/out/game.pak",
                               js_progress, "/web/web-manifest.json", None))
if out.get("ok"):
    rom = load_rom(Path("/rom/rom.gba"))
    game = GAMES[rom.sha1]
    # The SD card's layout: 3ds/<game>/ with the program, its icon and the pack.
    variant = Payload(Path("/web/payload")).for_rom(rom.sha1)
    with zipfile.ZipFile("/out/sd.zip", "w", zipfile.ZIP_DEFLATED) as zf:
        for exe in variant.executables():
            zf.write(exe, "%s/%s%s" % (game["dir"], game["exe"], exe.suffix))
        zf.write("/out/game.pak", "%s/%s.pak" % (game["dir"], game["app"]))
    out["game"] = game
json.dumps(out)
`));
    if (!result.ok) {
      post({ type: "error", message: result.error.message, hint: result.error.hint || "" });
      return;
    }
    const zip = pyodide.FS.readFile("/out/sd.zip");
    const game = result.game;
    post({ type: "done", zip, fileName: game.exe + "-SD.zip",
           note: "Extract it to the root of your SD card: it puts " + game.title + " in /" + game.dir + "/." },
         [zip.buffer]);
  } catch (e) {
    post({ type: "error", message: "The builder stopped unexpectedly.", hint: String(e && e.message || e) });
  }
};
