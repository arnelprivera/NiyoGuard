/* NiyoGuard server: serves the website and provides the AI endpoints.
   Run:  node server.js   (Node 18+, no npm install needed)
   Keys are read from environment variables or a local .env file and never reach the browser. */
const http = require("http");
const fs = require("fs");
const path = require("path");

/* ---- tiny .env loader ---- */
try {
    fs.readFileSync(path.join(__dirname, ".env"), "utf8")
        .split(/\r?\n/)
        .forEach((l) => {
            const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/i);
            if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
        });
} catch (e) {}

const PORT = process.env.PORT || 3000;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const OPENAI_KEY = process.env.OPENAI_API_KEY || ""; /* optional: Whisper speech-to-text fallback (supports Cebuano) */
const MAX_BODY = 30 * 1024 * 1024;

const SYSTEM_PROMPT = `You are NiyoGuard AI, a practical coconut pest and palm-health advisor for coconut farmers, mainly in the Philippines.

PESTS YOU KNOW (identify from photos, video frames, or descriptions):
- Coconut Rhinoceros Beetle (Oryctes rhinoceros): V-shaped cuts / triangular cut fronds, boreholes at the crown with fibrous frass, damaged unopened spears.
- Red Palm Weevil (Rhynchophorus ferrugineus / R. vulneratus): holes in trunk or crown with oozing brown liquid, chewed-fibre smell, wilting central fronds, crown collapse. Often fatal.
- Coconut Scale Insect / Cocolisap (Aspidiotus rigidus): white-yellow crusty scales on underside of leaflets, nuts, yellowing and drying fronds, sooty mold.
- Coconut Mealybugs (e.g. Pseudococcus / Nipaecoccus species): white cottony waxy clusters on fruits, spears, leaf bases; honeydew and sooty mold.
- Coconut Leaf Beetle (Brontispa longissima): scraped, longitudinal brown/whitish streaks on unopened leaflets; leaves look burnt, dried, and folded.
- Coconut Leaf Moth / Black-headed caterpillar (Opisina arenosella): caterpillars under silk-and-frass galleries on leaflet undersides, scorched look.
- Coconut Eriophyid Mite (Aceria guerreronis): triangular tan-brown patches near the nut's perianth, distorted small nuts, premature nut fall.
- Others: Coconut Hispine Beetle (Plesispa reichei), slug/bagworm caterpillars, coconut bugs (Amblypelta), termites, rats (gnawed nuts), and diseases that mimic pests (bud rot, bleeding stem, nutrient deficiency, lightning or wind damage).

RESEARCH KNOWLEDGE (background from three studies; explain in simple words, never invent other studies or numbers)
Sources if the farmer asks: Siderhurst et al. 2021 (Proceedings of the Hawaiian Entomological Society, field trials on Guam); Ekanayaka et al. 2022 (IEEE ICAC, Sri Lanka); Hajjaji et al. 2023 (Procedia Computer Science 225, red palm weevil).
- Rhinoceros beetle biology: only the adults damage palms, by boring into the crown to feed on sap, leaving V-shaped cuts in fronds. The palm can die if the growing point (meristem) is damaged. The larvae do not eat living palm tissue; they feed on rotting material. Breeding sites: dead standing palms, fallen logs, rotting stumps, decaying wood, compost, sawdust, manure piles, and on Guam also rotting debris trapped in the crowns of live palms. Sanitation (finding and destroying breeding sites) is the most important control step. The beetle is native to Southeast Asia including the Philippines.
- Males release an aggregation pheromone (oryctalure, ethyl 4-methyloctanoate) that is used in bucket traps.
- UV light and traps (Guam study): adding UV LEDs (400-405 nm) to pheromone traps caught about 2.85 times more beetles. In a cage test, UV LEDs caught 100 beetles and white LEDs 15. UV alone caught almost nothing in the field (2 beetles), so UV worked as a short-range cue together with the pheromone, not by itself. Catches were low overall, mass trapping did not stop new palm damage by itself, and a 10 times lower pheromone release did not change catches significantly. The homemade UV LED units mostly failed within about 3 months, so maintenance matters. The study did not test 365 nm.
- Biocontrol: a new beetle type on Guam (CRB-G) resisted the Oryctes virus. The Metarhizium majus fungus killed only 10-38% of beetles within 21 days, not enough alone. Best results come from combining sanitation, traps and biocontrol.
- Red Palm Weevil: the grubs live inside the trunk, so damage is often not seen until it is severe. Signs: brown liquid oozing from small trunk holes (stem bleeding), yellowing and wilting of the central crown, a crunching sound of feeding grubs, sudden collapse. It spreads when infested palms or planting material are moved. Research prototypes can detect larvae by sound with microphones and report high accuracy on test data, but a phone photo cannot see grubs inside the trunk. Badly infested palms often cannot be saved and are removed under official guidance; report to the PCA.
- Whitefly: tiny yellow spots that grow into large yellow patches and then dead tissue, with sticky honeydew and black sooty mold on leaflets below. It can look like other pests or a nutrient problem, so ask for a close-up of the underside of the leaflet.
- Plesispa beetle: brown dead patches or streaks on young leaves from feeding by larvae and adults; the patches grow into large dry areas. It can look like other leaf beetles, so ask for a close-up.
- Photo AI in those studies scored about 88% (weevil sound), 96% (Plesispa) and 98% (whitefly) on research datasets; real farms are messier. If asked how accurate you are, say you are a helpful guide, not a lab test.
- Whitefly and Plesispa are often treated with strong insecticides in practice. Do not recommend products; send the farmer to the PCA or local agriculture office.

HOW TO RESPOND
1. Look carefully at any images or video frames (multiple frames of the same video are different moments of one clip). Be honest about uncertainty: give a confidence level, name the most likely pest, list 1-2 look-alikes, and say what extra photo would settle it (for example crown close-up, underside of leaflet, the insect itself, trunk hole).
2. If no image or description shows a pest, say so. Never invent a pest. If the image is not a coconut palm or is too blurry, say that and ask for a better one.
3. Reply in the same language the farmer writes in (English, Filipino/Tagalog, or Cebuano/Bisaya). Use short sentences and simple words. Keep it practical and encouraging.
4. For a pest analysis, structure the reply with these exact "## " headings, each short:
   ## Identification
   ## Damage assessment
   ## Possible causes
   ## What to do now
   ## Prevention
   (Translate headings if replying in another language.) For follow-up questions and general advice, answer briefly without those headings.
5. Treatment: prefer integrated pest management (sanitation, removing and burying or burning breeding material, trapping with pheromone traps, biological control such as Metarhizium or Oryctes virus where relevant, trunk injection or chemical control only by trained people). Do NOT give pesticide dosages or mixing ratios. For chemicals or outbreaks, direct the farmer to the Philippine Coconut Authority (PCA) or the local agriculture office. Mention protective gear when chemicals come up. Red Palm Weevil and scale insect outbreaks should be reported.
6. NiyoGuard's device (365 nm UV-A bait, electric kill grid, ultrasonic leaf-pest deterrence, Bluetooth and 4G SMS alerts) mainly targets the Coconut Rhinoceros Beetle and discourages leaf-eating pests. It does not cure existing infestations. Published trap tests used 400-405 nm UV LEDs together with pheromone, so do not promise a catch rate for the 365 nm device. Say that traps help monitor and reduce adult beetles but work best together with sanitation of breeding sites. Only mention the device when relevant and be honest about these limits.
7. Never claim certainty from a photo alone. You are an advisor, not a lab.

MACHINE-READABLE SUMMARY
Whenever you analyzed a possible pest or damage (from an image, video, or a symptom description), end the reply with exactly one line in this form and nothing after it:
<summary>{"pest_detected":"yes|no|uncertain","pest":"name or None","infestation_level":"None|Low|Moderate|High|Severe|Unknown","protection_status":"Protected|At risk|Needs action|Unknown","confidence":"low|medium|high","actions":["short action 1","short action 2","short action 3"]}</summary>
Keep each action under 12 words, in the farmer's language. Omit the summary line for ordinary follow-up chat with no new analysis.`;

const MIME = {
    ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
    ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml",
    ".mp4": "video/mp4", ".ico": "image/x-icon", ".webp": "image/webp",
};
const PRIVATE = new Set(["server.js", "package.json", "package-lock.json", "readme.md"]);

/* ---- naive per-IP rate limit ---- */
const hits = new Map();
function limited(ip) {
    const now = Date.now(), w = (hits.get(ip) || []).filter((t) => now - t < 60000);
    w.push(now);
    hits.set(ip, w);
    return w.length > 20; /* 20 AI requests per minute per IP */
}

function send(res, code, obj) {
    res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    res.end(JSON.stringify(obj));
}
function readBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        req.on("data", (c) => {
            size += c.length;
            if (size > MAX_BODY) {
                reject(Object.assign(new Error("Upload too large"), { code: 413 }));
                req.destroy();
            } else chunks.push(c);
        });
        req.on("end", () => resolve(Buffer.concat(chunks)));
        req.on("error", reject);
    });
}

const OK_IMG = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

async function handleChat(req, res) {
    if (!ANTHROPIC_KEY) return send(res, 503, { error: "AI is not configured. Set ANTHROPIC_API_KEY on the server." });
    let body;
    try {
        body = JSON.parse((await readBody(req)).toString("utf8"));
    } catch (e) {
        return send(res, e.code || 400, { error: e.code === 413 ? "Upload too large. Try a shorter video or smaller photos." : "Invalid request." });
    }
    const incoming = Array.isArray(body.messages) ? body.messages.slice(-14) : [];
    const messages = [];
    let imgCount = 0;
    for (const m of incoming) {
        if (!m || (m.role !== "user" && m.role !== "assistant")) continue;
        const text = String(m.content || "").slice(0, 6000);
        const parts = [];
        if (m.role === "user" && Array.isArray(m.images)) {
            for (const im of m.images.slice(0, 8)) {
                if (!im || !OK_IMG.has(im.media_type) || typeof im.data !== "string") continue;
                if (++imgCount > 8) break;
                parts.push({ type: "image", source: { type: "base64", media_type: im.media_type, data: im.data } });
            }
        }
        if (text) parts.push({ type: "text", text });
        if (!parts.length) continue;
        const content = m.role === "assistant" ? text : parts;
        /* Claude requires alternating roles: merge same-role neighbours */
        const last = messages[messages.length - 1];
        if (last && last.role === m.role) {
            if (m.role === "assistant") last.content += "\n" + text;
            else last.content = last.content.concat(parts);
        } else messages.push({ role: m.role, content });
    }
    while (messages.length && messages[0].role !== "user") messages.shift();
    if (!messages.length || messages[messages.length - 1].role !== "user")
        return send(res, 400, { error: "Please send a message, photo, or video." });

    try {
        const r = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
            body: JSON.stringify({ model: MODEL, max_tokens: 1600, system: SYSTEM_PROMPT, messages }),
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) {
            console.error("Anthropic error", r.status, data && data.error);
            const msg = r.status === 401 ? "The AI key is invalid." : r.status === 429 ? "The AI is busy. Please try again in a moment." : r.status === 413 ? "Files too large. Try fewer or smaller photos." : "The AI service had a problem. Please try again.";
            return send(res, 502, { error: msg });
        }
        const reply = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
        send(res, 200, { reply: reply || "I could not produce an answer. Please try again." });
    } catch (e) {
        console.error(e);
        send(res, 502, { error: "Could not reach the AI service." });
    }
}

/* Optional speech-to-text fallback for browsers without built-in recognition (and for Cebuano) */
async function handleTranscribe(req, res) {
    if (!OPENAI_KEY) return send(res, 503, { error: "Server speech-to-text is not configured." });
    try {
        const audio = await readBody(req);
        const type = (req.headers["content-type"] || "audio/webm").split(";")[0];
        const ext = type.includes("mp4") ? "mp4" : type.includes("ogg") ? "ogg" : type.includes("wav") ? "wav" : "webm";
        const fd = new FormData();
        fd.append("file", new Blob([audio], { type }), "voice." + ext);
        fd.append("model", "whisper-1");
        const lang = new URL(req.url, "http://x").searchParams.get("lang");
        if (lang && /^[a-z]{2,3}$/.test(lang)) fd.append("language", lang);
        const r = await fetch("https://api.openai.com/v1/audio/transcriptions", { method: "POST", headers: { Authorization: "Bearer " + OPENAI_KEY }, body: fd });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) return send(res, 502, { error: "Speech-to-text failed." });
        send(res, 200, { text: data.text || "" });
    } catch (e) {
        send(res, e.code || 500, { error: "Speech-to-text failed." });
    }
}

function serveStatic(req, res) {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p === "/") p = "/index.html";
    const file = path.normalize(path.join(__dirname, p));
    const base = path.basename(file).toLowerCase();
    if (!file.startsWith(__dirname + path.sep) || base.startsWith(".") || PRIVATE.has(base) || !MIME[path.extname(file).toLowerCase()]) {
        res.writeHead(404);
        return res.end("Not found");
    }
    fs.stat(file, (err, st) => {
        if (err || !st.isFile()) {
            res.writeHead(404);
            return res.end("Not found");
        }
        const type = MIME[path.extname(file).toLowerCase()];
        const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
        if (range) {
            const start = range[1] ? parseInt(range[1], 10) : 0;
            const end = range[2] ? Math.min(parseInt(range[2], 10), st.size - 1) : st.size - 1;
            res.writeHead(206, { "Content-Type": type, "Content-Range": `bytes ${start}-${end}/${st.size}`, "Accept-Ranges": "bytes", "Content-Length": end - start + 1 });
            return fs.createReadStream(file, { start, end }).pipe(res);
        }
        res.writeHead(200, { "Content-Type": type, "Content-Length": st.size, "Accept-Ranges": "bytes", "Cache-Control": "no-cache" });
        fs.createReadStream(file).pipe(res);
    });
}

http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/api/health") return send(res, 200, { ok: true, ai: !!ANTHROPIC_KEY, stt: !!OPENAI_KEY });
    if (url === "/api/chat" || url === "/api/transcribe") {
        if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
        const ip = req.socket.remoteAddress || "x";
        if (limited(ip)) return send(res, 429, { error: "Too many requests. Please wait a minute." });
        return url === "/api/chat" ? handleChat(req, res) : handleTranscribe(req, res);
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(405);
        return res.end();
    }
    serveStatic(req, res);
}).listen(PORT, () => {
    console.log(`NiyoGuard running at http://localhost:${PORT}`);
    console.log(ANTHROPIC_KEY ? `AI model: ${MODEL}` : "WARNING: ANTHROPIC_API_KEY is not set. The chatbot will show a setup message.");
    if (!OPENAI_KEY) console.log("Server speech-to-text off (optional OPENAI_API_KEY). Browser speech recognition still works.");
});
