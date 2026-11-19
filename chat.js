/* NiyoGuard chatbot: tappable Bisaya questions with pre-written Bisaya answers.
   No server or API key needed. To add or edit a question, change the QA list below.
   Sources: ATI Caraga articles on the Training on Integrated Pest Management (IPM) for Coconut, August 2025
   (Tago, Surigao del Sur and Prosperidad, Agusan del Sur). */
(() => {
    const $ = (s) => document.querySelector(s);
    const chat = $("#chat"), box = $("#chMsgs"), fab = $("#chFab");
    if (!chat || !box || !fab) return;

    const SRC = {
        tago: "ATI Caraga (Agosto 2025), “Coconut farmers in SurSur complete Training on IPM”",
        pros: "ATI Caraga (Agosto 2025), “Agusan del Sur farmers learn modern coconut pest and disease control”",
    };

    /* Each answer: array of lines. Lines starting with "- " become a list. Use **text** for bold. */
    const QA = {
        ipm: {
            q: "Unsa ang IPM nga gitudlo sa mga mag-uuma sa lubi?",
            a: [
                "Ang **IPM** o Integrated Pest Management kay paagi sa pagdumala sa peste sa lubi nga **sustainable ug gipasukad sa siyensiya**.",
                "Sa training, gitudlo ang mga prinsipyo niini ug kung nganong importante ang husto nga pagdumala sa **peste, sakit, ug sagbot** sa kalubihan.",
                "Ang tumong: makahibalo ang mag-uuma unsaon pag-ila ug pagkontrolar sa peste sa maayong paagi, dili lang basta mosalig sa kemikal.",
            ],
            src: ["tago", "pros"],
            next: ["gitudlo", "log"],
        },
        gitudlo: {
            q: "Unsa ang mga gitun-an sa training?",
            a: [
                "Naay lekturang ug praktikal nga pagbansay gikan sa mga eksperto. Ang mga hilisgutan:",
                "- ang kahimtang sa industriya sa lubi sa Pilipinas ug ang **CFIDP**",
                "- ngano nga importante ang IPM",
                "- pagkontrolar sa **dagkong peste, sakit, ug sagbot**",
                "- pag-ila ug pag-classify sa nagkalainlaing peste ug sakit",
                "- paggamit og **biological agents** batok sa peste",
                "- **insecticide resistance management**",
                "- pagbuhat og plano aron madala sa mga mag-uuma ang nakat-unan ngadto sa ilang kaugalingong uma",
            ],
            src: ["tago"],
            next: ["insecticide", "uma"],
        },
        log: {
            q: "Unsaon pagbuhat og log trap batok sa bagang?",
            a: [
                "Sa field practicum, ang mga mag-uuma nagbuhat og **log trap** nga gamit ang **green muscardine fungus** ug **pheromone** aron makontrol ang **bagang** (rhinoceros beetle).",
                "Wala gidetalye sa mga artikulo ang matag lakang sa paghimo niini, mao nga **mangayo og giya sa PCA o sa opisina sa agrikultura** sa inyong lungsod, o motambong sa susamang training.",
            ],
            src: ["tago", "pros"],
            next: ["uhong", "monitor"],
        },
        uhong: {
            q: "Unsa ang green muscardine fungus ug unsay gamit niini?",
            a: [
                "Ang **green muscardine fungus** usa ka **uhong** nga gigamit isip **biological control agent** batok sa peste sa lubi, sama sa bagang.",
                "Gigamit kini sa mga mag-uuma kauban sa log trap, ug sa pheromone sa laing pagbansay sa Tago.",
                "Kini ang pamaagi nga naggamit og natural nga kaaway sa peste imbes kemikal.",
            ],
            src: ["tago", "pros"],
            next: ["log", "insecticide"],
        },
        monitor: {
            q: "Unsaon pag-ila sa peste sa lubi samtang sayo pa?",
            a: [
                "Ang sayo nga pag-ila nagsugod sa **pagbantay sa uma**. Sa practicum, gihimo sa mga mag-uuma ang mosunod:",
                "- **pagkolekta ug pag-ila** sa mga insekto nga peste",
                "- **pag-obserbar** sa mga peste ug sakit sa mismong dapit sa pagbansay",
                "Importante kini kay kung makita sa sayo, mas dali mapugngan nga mokaylap ang peste.",
            ],
            src: ["pros", "tago"],
            next: ["natural", "dili"],
        },
        natural: {
            q: "Unsaon pag-ila ang peste gikan sa natural nga kaaway niini?",
            a: [
                "Dili tanang insekto sa lubi peste. Ang uban **natural nga kaaway** sa peste ug nagtabang pa nga mapugngan kini.",
                "Matud sa usa ka batan-ong mag-uuma nga mitambong, gitudlo sa training kung unsaon **pag-ila ang insekto nga peste gikan sa natural nga kaaway**, ug unsaon pagdumala sa matag usa.",
            ],
            src: ["tago"],
            next: ["monitor", "dili"],
        },
        insecticide: {
            q: "Unsa ang insecticide resistance management?",
            a: [
                "Usa kini sa mga hilisgutan sa training nga nagtudlo kung nganong **importante ang husto nga paggamit sa insecticide**.",
                "Ang ideya niini: kung sobra o sayop ang gamit, mahimong **mabatasan** ang peste ug dili na molihok ang tambal.",
                "Alang sa piho nga tambal o paagi, pangutana sa **PCA o sa opisina sa agrikultura**.",
            ],
            src: ["tago"],
            next: ["uhong", "dili"],
        },
        uma: {
            q: "Unsay buhaton human sa training aron magamit sa akong uma?",
            a: [
                "Gitabangan ang mga mag-uuma nga mobuhat og **re-entry plan**, usa ka praktikal nga plano sa pagpadapat sa nakat-unan sa ilang kaugalingong uma.",
                "Gipaabot usab nga ipaambit nila ang nakat-unan sa ubang mag-uuma. Ang usa ka batan-ong mag-uuma gikan sa Tandag City miingon nga **ipasabot niya ang iyang nakat-unan sa mga kauban niyang mag-uuma sa lubi**.",
            ],
            src: ["tago"],
            next: ["gitudlo", "kinsa"],
        },
        kinsa: {
            q: "Kinsa ang nag-organisar ug nagtudlo sa training?",
            a: [
                "Gipangunahan kini sa **ATI Regional Training Center XIII** (Agricultural Training Institute) kauban ang **Philippine Coconut Authority (PCA)**, ubos sa **CFIDP**.",
                "Ang mga resource person gikan sa:",
                "- **Caraga State University**",
                "- **PCA** sa Surigao del Sur ug Agusan del Sur",
                "- **Bureau of Plant Industry** (Plant Quarantine Service)",
                "- **Amparitas Integrated Natures Farm** sa Hinatuan, Surigao del Sur",
            ],
            src: ["tago", "pros"],
            next: ["cfidp", "asa"],
        },
        cfidp: {
            q: "Unsa ang CFIDP?",
            a: [
                "Ang **CFIDP** mao ang **Coconut Farmers and Industry Development Plan**. Ubos niini gihimo ang mga training sa IPM alang sa mga mag-uuma sa lubi.",
                "Ang katuyoan sa training mao ang pagpalig-on sa abilidad sa mga mag-uuma sa pagpugong ug pagkontrolar sa peste ug sakit, aron mas himsog ang kalubihan ug **molungtad ang ilang kinabuhi**.",
            ],
            src: ["pros", "tago"],
            next: ["kinsa", "ipm"],
        },
        asa: {
            q: "Asa ug kanus-a gihimo ang mga training?",
            a: [
                "Duha ka training sa Agosto 2025:",
                "- **Agosto 6–8**, Farmersinn, Poblacion, **Prosperidad, Agusan del Sur**. **35** ka mag-uuma ang miapil. Ang practicum gihimo sa Bunawan.",
                "- **Agosto 13–15**, VFS Agri-Tourism and Adventure Park, Jubang, **Tago, Surigao del Sur**. **38** ka mag-uuma ang nakahuman.",
            ],
            src: ["pros", "tago"],
            next: ["kinsa", "gitudlo"],
        },
        dili: {
            q: "Unsay buhaton kung dili ako sigurado kung unsang peste kini?",
            a: [
                "Ayaw pagdesisyon gikan sa usa ka ilhanan lang.",
                "- **Tan-awa pag-ayo** ang lubi ug kolektaha ang insekto kung mahimo, sama sa gibuhat sa mga mag-uuma sa practicum.",
                "- Pangutana sa **PCA o sa opisina sa agrikultura** sa inyong lungsod.",
                "- Mahimong motambong sa **IPM training** sa ATI ug PCA.",
                "Ang chatbot nga kini gabay lang ug dili puli sa eksperto.",
            ],
            src: ["tago"],
            next: ["monitor", "niyo"],
        },
        niyo: {
            q: "Makatabang ba ang NiyoGuard ug unsa ang limitasyon niini?",
            a: [
                "Ang NiyoGuard adunay 365 nm nga UV-A nga suga, electric nga grid, ultrasonic, ug alerto pinaagi sa Bluetooth ug 4G SMS. Ang tumong niini mao ang **bagang** ug ang pagpahilayo sa mga peste nga mokaon sa dahon.",
                "Mga limitasyon:",
                "- **Dili kini makaayo** sa lubi nga giatake na.",
                "- **Dili kini puli sa IPM**. Sa training, ang gigamit batok sa bagang mao ang log trap, green muscardine fungus, ug pheromone, dugang sa pagbantay sa uma.",
                "- Mas maayo ang resulta kung kauban sa maayong pagdumala sa uma ug sa giya sa PCA.",
            ],
            src: ["tago", "pros"],
            next: ["log", "dili"],
        },
        tinubdan: {
            q: "Asa gikan ang mga impormasyon sa chatbot?",
            a: [
                "Ang mga tubag gikan sa duha ka artikulo sa **ATI Caraga** mahitungod sa Training on Integrated Pest Management (IPM) for Coconut:",
                "- **Coconut farmers in SurSur complete Training on IPM** (Tago, Surigao del Sur)",
                "- **Agusan del Sur farmers learn modern coconut pest and disease control** (Prosperidad, Agusan del Sur)",
                "Alang sa mga kemikal o dako nga pag-atake sa peste, **pangutana sa PCA** o sa opisina sa agrikultura.",
            ],
            src: [],
            next: ["niyo", "dili"],
        },
    };

    const GROUPS = [
        { t: "Mahitungod sa IPM training", q: ["ipm", "gitudlo", "kinsa", "cfidp", "asa"] },
        { t: "Bagang sa lubi", q: ["log", "uhong"] },
        { t: "Pag-ila ug pagpugong sa peste", q: ["monitor", "natural", "insecticide", "dili"] },
        { t: "Human sa training", q: ["uma"] },
        { t: "NiyoGuard ug tinubdan", q: ["niyo", "tinubdan"] },
    ];

    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
    function body(lines) {
        let html = "", list = false;
        lines.forEach((l) => {
            if (l.startsWith("- ")) {
                if (!list) { html += "<ul>"; list = true; }
                html += "<li>" + inline(l.slice(2)) + "</li>";
            } else {
                if (list) { html += "</ul>"; list = false; }
                html += "<p>" + inline(l) + "</p>";
            }
        });
        return html + (list ? "</ul>" : "");
    }

    function add(role, html) {
        const d = document.createElement("div");
        d.className = "m " + role;
        d.innerHTML = '<div class="mb">' + html + "</div>";
        box.appendChild(d);
        box.scrollTop = box.scrollHeight;
        return d;
    }

    function menu() {
        let html = '<div class="qmenu">';
        GROUPS.forEach((g) => {
            html += '<h4>' + esc(g.t) + "</h4>";
            g.q.forEach((id) => (html += '<button type="button" class="qb" data-q="' + id + '">' + esc(QA[id].q) + "</button>"));
        });
        const d = add("bot menu", html + "</div>");
        box.scrollTop = d.offsetTop - 8;
    }

    function welcome() {
        box.innerHTML = "";
        add("bot", "<p>Maayong adlaw! Ako ang <b>NiyoGuard</b>, tabang bahin sa mga peste sa lubi.</p>");
        menu();
    }

    let timer;
    function ask(id) {
        const x = QA[id];
        if (!x) return;
        clearTimeout(timer);
        box.querySelectorAll(".qnext,.m.menu").forEach((e) => e.remove());
        add("user", esc(x.q));
        const t = add("bot typing", '<span class="dots"><i></i><i></i><i></i></span>');
        timer = setTimeout(() => {
            t.remove();
            let html = body(x.a);
            if (x.src.length) html += '<p class="src">Tinubdan: ' + x.src.map((k) => esc(SRC[k])).join("; ") + "</p>";
            const m = add("bot", html);
            const nx = document.createElement("div");
            nx.className = "qnext";
            nx.innerHTML =
                x.next.map((n) => '<button type="button" data-q="' + n + '">' + esc(QA[n].q) + "</button>").join("") +
                '<button type="button" class="all" data-menu="1">Tanang pangutana</button>';
            box.appendChild(nx);
            box.scrollTop = m.offsetTop - 8;
        }, 450);
    }

    box.addEventListener("click", (e) => {
        const q = e.target.closest("[data-q]");
        if (q) return ask(q.dataset.q);
        if (e.target.closest("[data-menu]")) {
            box.querySelectorAll(".qnext,.m.menu").forEach((n) => n.remove());
            menu();
        }
    });
    $("#chNew").onclick = () => { clearTimeout(timer); welcome(); };

    /* ---------- open / close ---------- */
    function openChat(on) {
        chat.hidden = !on;
        fab.setAttribute("aria-expanded", on);
        fab.setAttribute("aria-label", on ? "Isira ang chat" : "Ablihi ang NiyoGuard chat");
    }
    fab.onclick = () => openChat(chat.hidden);
    $("#chClose").onclick = () => openChat(false);
    document.addEventListener("click", (e) => {
        if (chat.hidden) return;
        const p = e.composedPath();
        if (p.includes(chat) || p.includes(fab)) return;
        openChat(false);
    });
    addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !chat.hidden) openChat(false);
    });

    welcome();
})();
