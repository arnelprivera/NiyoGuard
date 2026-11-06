/* Mark JS as available so the CSS only hides reveal elements when scripts run */
document.documentElement.classList.add("js");

/* ===== Configuration (edit once details are finalized) ===== */
const CONFIG = {
    price: 13900,
    currency: "₱",
    availability: "Availability to be confirmed",
};
/* ===== Helpers ===== */
const $ = (s, r = document) => r.querySelector(s),
    $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = (n) =>
    CONFIG.price == null ?
    "Price to be announced" :
    CONFIG.currency +
    n.toLocaleString(undefined, { minimumFractionDigits: 0 });
const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
let qty = 1;
/* ===== Navigation ===== */
const header = $("header");
const nav = $("header nav");
addEventListener(
    "scroll",
    () => {
        const t = Math.min(scrollY / 50, 1); // 0 -> 1 over the first 50px
        header.classList.toggle("s", scrollY > 10);
        nav.style.setProperty("--a", 0.88 + 0.1 * t); // glass opacity
        nav.style.setProperty("--b", 8 + 16 * t + "px"); // glass blur
    }, { passive: true },
);

// Highlight the nav link of the section currently in view
const spy = new IntersectionObserver(
    (entries) =>
    entries
    .filter((e) => e.isIntersecting)
    .forEach((e) =>
        $$(".links a").forEach((a) =>
            a.classList.toggle(
                "on",
                a.getAttribute("href") === "#" + e.target.id,
            ),
        ),
    ), { rootMargin: "-40% 0px -55% 0px" },
);
["about", "features", "order"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) spy.observe(el);
});

/* ===== Scroll reveal ===== */
const ro = new IntersectionObserver(
    (es) =>
    es.forEach((e) => {
        if (e.isIntersecting) {
            e.target.classList.add("in");
            ro.unobserve(e.target);
        }
    }), { rootMargin: "0px 0px -100px 0px" },
);
$$(".rv").forEach((el) => ro.observe(el));
/* ===== Product videos: pause when off-screen or if reduced motion is on ===== */
$$("video").forEach((v) => {
    if (reduce) {
        v.pause();
        v.removeAttribute("autoplay");
        v.controls = true;
        return;
    }
    new IntersectionObserver((es) =>
        es.forEach((e) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause())), { threshold: 0.2 },
    ).observe(v);
});
/* ===== Ticker ===== */
const tkItems = [
    "Solar-Powered Operation",
    "Ultrasonic Deterrence",
    "Bluetooth and 4G SMS Alerts",
    "Smart Farm Protection",
    "Sustainable Technology",
    "Made for Coconut Farmers",
];
const tkSet = [...tkItems, ...tkItems]
    .map((t) => `<span><i class="ck">✓</i>${t}</span>`)
    .join("");
$("#mt").innerHTML = tkSet + tkSet;
/* ===== How-it-works gallery ===== */
const wide = matchMedia("(min-width:981px)");
let pt;
$$(".pn").forEach((p) => {
    const on = () => {
        if (!p.classList.contains("on"))
            $$(".pn").forEach((x) => x.classList.toggle("on", x === p));
    };
    p.addEventListener("mouseenter", () => {
        if (wide.matches) {
            clearTimeout(pt);
            pt = setTimeout(on, 120);
        }
    });
    p.addEventListener("mouseleave", () => clearTimeout(pt));
    p.addEventListener("focus", () => {
        if (wide.matches) on();
    });
    p.addEventListener("click", on);
});
/* ===== Scroll-reveal scene (farm, device and rat) ===== */
function scene(f) {
    const ol =
        'fill="none" stroke="#3F7A12" stroke-opacity=".4" stroke-width="1.5" stroke-dasharray="6 6"',
        fl = 'fill="#4A8A14" stroke="#9BD62A" stroke-width="2"';
    const nut = (cx, cy, r) =>
        `<circle cx="${cx}" cy="${cy}" r="${r}" ${f ? 'fill="#2F5A0C" stroke="#9BD62A" stroke-width="2"' : ol}/>`;
    const palm = (x, h, k, focal) => {
        const y = 520 - h,
            mx = 8.5 * k,
            my = 520 - h / 2;
        let g =
            `<g transform="translate(${x} 0)"><path d="M0 520Q${14 * k} ${520 - h / 2} ${6 * k} ${y}" ${f ? 'fill="none" stroke="#4A8A14" stroke-width="' + 9 * k + '"' : ol}/>` + [-150, -110, -70, -30, 10, 150]
            .map(
                (a) =>
                `<path transform="translate(${6 * k} ${y}) rotate(${a})" d="M0 0Q${30 * k} ${-70 * k} ${85 * k} ${-18 * k}Q${30 * k} ${-26 * k} 0 0Z" ${f ? fl : ol}/>`,
            )
            .join("") +
            nut(6 * k - 9 * k, y + 12 * k, 6 * k) +
            nut(6 * k + 8 * k, y + 14 * k, 6 * k) +
            nut(6 * k, y + 22 * k, 6 * k);
        if (focal) {
            g +=
                `<rect x="${mx - 9}" y="${my - 16}" width="18" height="32" rx="5" ${f ? 'fill="#fff" stroke="#3F7A12" stroke-width="2"' : ol}/>` +
                (f ?
                    `<circle cx="${mx}" cy="${my - 6}" r="3.5" fill="#9BD62A"/>` + [0, 1, 2]
                    .map(
                        (i) =>
                        `<circle class="wave" style="animation-delay:${i}s" cx="${mx}" cy="${my}" r="34" fill="none" stroke="#9BD62A" stroke-width="2"/>`,
                    )
                    .join("") :
                    "");
        }
        return g + "</g>";
    };
    const rat = `<g class="rat" style="transform:translate(380px,492px)"><g transform="scale(1.4)" ${f ? 'fill="#3a4a2c" stroke="#fff" stroke-width="1.6"' : ol}><path d="M-24 -6Q-48 -4 -58 8Q-46 0 -26 4" fill="none"/><ellipse cx="0" cy="-12" rx="24" ry="12"/><ellipse cx="26" cy="-14" rx="11" ry="8"/><path d="M36 -16L47 -12L36 -9Z"/><circle cx="22" cy="-22" r="4.5"/><path d="M-10 -2L-12 6M10 -2L12 6" fill="none"/></g></g>`;
    return (
        `<svg viewBox="-300 0 1600 560" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><path d="M-300 530Q-100 520 0 520Q250 470 500 510T1000 500Q1150 495 1300 505V560H-300Z" ${f ? 'fill="#2F5A0C" stroke="#7AB51D"' : ol}/>` + [
            [130, 250, 1],
            [300, 330, 1.25],
            [700, 310, 1.2],
            [880, 240, 0.95],
            [-130, 260, 1.05],
            [1110, 280, 1.1],
        ]
        .map((a) => palm(...a))
        .join("") +
        palm(500, 300, 1.15, true) +
        rat +
        "</svg>"
    );
}
const rs = $("#reveal"),
    rt = $("#rtop");
const rsl = $$("#rsteps li"),
    rfill = $("#rfill"),
    rcut = [0.3, 0.55, 0.8];
$$(".svgw").forEach((w, i) => (w.innerHTML = scene(i)));
let rq = false,
    nar = false;
/* On tall/narrow screens, frame the scene tightly around the farm so the rat stays in view */
function fit() {
    nar = innerWidth < 700 || innerWidth / innerHeight < 1.2;
    $$(".svgw svg").forEach((s) => {
        s.setAttribute("viewBox", nar ? "60 0 880 560" : "-300 0 1600 560");
        s.setAttribute("preserveAspectRatio", nar ? "xMidYMax meet" : "xMidYMax slice");
    });
}

function rp() {
    rq = false;
    const r = rs.getBoundingClientRect(),
        d = r.height - innerHeight,
        p = reduce || d <= 0 ? 1 : Math.min(1, Math.max(0, -r.top / d));
    rt.style.clipPath = `circle(${p * 150}% at 50% 50%)`;
    rfill.style.transform = `scaleX(${p})`;
    rsl.forEach((li, i) => li.classList.toggle("on", p >= rcut[i]));
    $$(".svgw").forEach((w) => (w.style.transform = `scale(${1 + 0.15 * p})`));
    const rt2 = $("#rtop .rat");
    if (rt2) {
        /* Narrow screens reveal the bottom of the scene later, so the rat starts running later and covers less ground */
        const p0 = nar ? 0.4 : 0.1,
            fl = p > p0,
            x = 380 - Math.max(0, p - p0) * (nar ? 930 : 900),
            gy =
            492 +
            (x < 380 ? (380 - x) * 0.06 : 0) +
            (fl ? Math.sin(p * 80) * 3 : 0);
        rt2.style.transform = `translate(${x}px,${gy}px) scale(${fl ? -1 : 1},1)`;
    }
}
addEventListener(
    "scroll",
    () => {
        if (!rq) {
            rq = true;
            requestAnimationFrame(rp);
        }
    }, { passive: true },
);
addEventListener("resize", () => {
    fit();
    rp();
});
fit();
rp();
/* ===== Custom cursor & scroll lock ===== */
const cur = $("#cur");
if (matchMedia("(pointer:fine)").matches) {
    document.body.classList.add("cc");
    addEventListener("mousemove", (e) => {
        const m = !!$("dialog[open]");
        document.body.classList.toggle("cc", !m);
        cur.style.opacity = m ? 0 : 1;
        cur.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
        cur.classList.toggle(
            "big", !!e.target.closest("a,button,[data-open],.pn,input,textarea"),
        );
    });
    document.addEventListener("mouseleave", () => (cur.style.opacity = 0));
}
$$("dialog").forEach((d) =>
    d.addEventListener("close", () => {
        if (!$("dialog[open]")) document.body.style.overflow = "";
    }),
);
/* ===== Dialogs ===== */
const dlg = (id) => document.getElementById(id);

function openD(id) {
    $$("dialog[open]").forEach((d) => d.close());
    dlg(id).showModal();
    document.body.style.overflow = "hidden";
}
document.addEventListener("click", (e) => {
    const o = e.target.closest("[data-open]");
    if (o) {
        e.preventDefault();
        openD(o.dataset.open);
    }
    if (e.target.closest("[data-close]")) e.target.closest("dialog").close();
    if (e.target.tagName === "DIALOG") e.target.close();
});
/* ===== Order form ===== */
const ORDER_EMAIL = "riveraarnel556@gmail.com";
const ORDER_PHONE = "+639159319555";
const form = $("#of");
const qv = $("#qv");
const syncOrder = (fromInput) => {
    if (!fromInput) qv.value = qty;
    $("#sl").textContent = "NiyoGuard × " + qty;
    $("#up").textContent = CONFIG.price == null ? "Price to be announced" : money(CONFIG.price);
    $("#st").textContent =
        CONFIG.price == null ? "To be announced" : money(CONFIG.price * qty);
};
$("#qm").onclick = () => {
    qty = Math.max(1, qty - 1);
    syncOrder();
};
$("#qp").onclick = () => {
    qty = Math.min(99, qty + 1);
    syncOrder();
};
/* typing a quantity */
qv.addEventListener("input", () => {
    const n = parseInt(qv.value, 10);
    if (n >= 1) {
        qty = Math.min(99, n);
        syncOrder(true);
    }
});
qv.addEventListener("change", () => {
    qty = Math.min(99, Math.max(1, parseInt(qv.value, 10) || 1));
    syncOrder();
});
syncOrder();
const checks = {
    name: (v) => (v.trim() ? "" : "Enter your full name."),
    email: (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address.",
    address: (v) => (v.trim() ? "" : "Enter your delivery address."),
};
const val = (n) => form.elements[n].value.trim();
const orderParts = () => {
    const unit = CONFIG.price == null ? "To be announced" : money(CONFIG.price);
    const total = CONFIG.price == null ? "To be announced" : money(CONFIG.price * qty);
    return {
        subject: "NiyoGuard Order - " + (val("name") || "New customer"),
        body: [
            "Hello NiyoGuard,",
            "",
            "I would like to place an order.",
            "",
            "Product: NiyoGuard IoT Device",
            "Quantity: " + qty,
            "Price per unit: " + unit,
            "Total: " + total,
            "",
            "Full name: " + val("name"),
            ...(val("email") ? ["Email: " + val("email")] : []),
            "Delivery address: " + val("address"),
            "Notes: " + (val("notes") || "None"),
        ].join("\r\n"),
    };
};
const sendOrder = (method) => {
    qty = Math.min(99, Math.max(1, parseInt(qv.value, 10) || 1));
    syncOrder();
    let first = null;
    for (const [n, check] of Object.entries(checks)) {
        const i = form.elements[n],
            msg = n === "email" && method !== "email" ? "" : check(i.value);
        i.closest("label").querySelector("small").textContent = msg;
        i.setAttribute("aria-invalid", !!msg);
        if (msg && !first) first = i;
    }
    if (first) return first.focus();
    const o = orderParts();
    const enc = encodeURIComponent;
    const plain = o.body.replace(/\r\n/g, "\n");
    const m = $("#om");
    if (method === "sms") {
        location.href = "sms:" + ORDER_PHONE + "?&body=" + enc(plain);
        m.textContent = "Your messaging app should open with your order. Press Send to complete it.";
    } else if (matchMedia("(pointer:coarse)").matches) {
        location.href = "mailto:" + ORDER_EMAIL + "?subject=" + enc(o.subject) + "&body=" + enc(o.body);
        m.textContent = "Your email app should open with your order. Press Send to complete it.";
    } else {
        window.open(
            "https://mail.google.com/mail/?view=cm&fs=1&to=" + ORDER_EMAIL + "&su=" + enc(o.subject) + "&body=" + enc(o.body),
            "_blank",
            "noopener",
        );
        m.textContent = "Your email draft opened in a new tab. Press Send to complete your order.";
    }
    m.hidden = false;
};
form.addEventListener("submit", (e) => {
    e.preventDefault();
    sendOrder(form.elements.method.value);
});
const methodLabels = { email: "Email", sms: "Number" };
form.querySelectorAll('input[name="method"]').forEach((r) =>
    r.addEventListener("change", () => {
        applyMethod(r.value);
    }),
);
function applyMethod(method) {
    $("#osb").textContent = "Send Order by " + methodLabels[method];
    const show = method === "email";
    ["email"].forEach((n) => {
        const i = form.elements[n],
            l = i.closest("label");
        l.style.display = show ? "" : "none";
        l.querySelector("small").textContent = "";
        i.removeAttribute("aria-invalid");
        if (!show) i.value = "";
    });
    $(".orow").style.gridTemplateColumns = show ? "" : "1fr";
}
applyMethod(form.elements.method.value);

const XL = {
    0: ["ESP32-S3 Board", "in", 64, 100],
    4: ["4G LTE Module", "in", 64, 200],
    3: ["Ultrasonic Driver", "in", 64, 300],
    7: ["MPPT Controller", "in", 64, 400],
    8: ["LiFePO\u2084 Battery", "in", 64, 500],
    9: ["4S BMS", "in", 64, 600],
    10: ["Buck Converter", "in", 496, 100],
    11: ["Voltage Monitor", "in", 496, 200],
    12: ["Fuse + Holder", "in", 496, 300],
    13: ["Cell Holder", "in", 496, 400],
    15: ["PCB + Wiring", "in", 496, 500],
    6: ["30W Solar Panel", "panel", 280, 66, 280, 150, 200, 100],
    14: ["IP65 Enclosure", "box", 280, 330, 280, 330, 170, 150],
    5: ["LTE Antenna", "ant", 400, 185, 398, 235, 14, 110],
    1: ["IR Break-Beam", "ir", 280, 640, 280, 445, 64, 48],
    2: ["Ultrasonic Transducers", "pair", 280, 520, 280, 330, 44, 44],
};
const NS = "http://www.w3.org/2000/svg";
const xs = $("#xs");
const xb = $("#xb");
const mk = (tag, attrs, parent) => {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
};
const xrows = $$("#parts tbody tr").map((r) => [...r.cells].map((c) => c.textContent.trim()));
const place = (g, x, y, s) => g.style.setProperty("--t", "translate(" + x + "px," + y + "px) scale(" + s + ")");
const buildX = () => {
    const lines = mk("g", {}, xs),
        parts = mk("g", {}, xs),
        labels = mk("g", {}, xs);
    let order = 0;
    Object.keys(XL).forEach((k) => {
        const row = xrows[k],
            c = XL[k],
            n = +k + 1,
            internal = c[1] === "in",
            ex = c[2],
            ey = c[3],
            ax = internal ? 280 : c[4],
            ay = internal ? 330 : c[5],
            w = internal ? 104 : c[6] || 112,
            hh = internal ? 46 : c[7] || 46;
        const delay = order++ * 55 + "ms";
        mk("line", { class: "ln", x1: 280, y1: 330, x2: ex, y2: ey, style: "transition-delay:" + delay }, lines);
        const make = (px, py, qx, qy, rw, rh, shape) => {
            const g = mk("g", { class: "px " + c[1] + (internal ? " in" : ""), "data-k": k, tabindex: 0, style: "transition-delay:" + delay }, parts);
            g.style.setProperty("--a", "translate(" + qx + "px," + qy + "px) scale(" + (internal ? 0.45 : 1) + ")");
            g.style.setProperty("--e", "translate(" + px + "px," + py + "px) scale(1)");
            if (shape === "circle") {
                mk("circle", { r: 22, class: "sh" }, g);
                mk("circle", { r: 9, class: "sh2" }, g);
            } else {
                mk("rect", { x: -rw / 2, y: -rh / 2, width: rw, height: rh, rx: c[1] === "box" ? 16 : 10, class: "sh" }, g);
            }
            if (c[1] === "panel") {
                for (let i = 1; i < 6; i++) mk("line", { x1: -100 + i * 33.3, y1: -50, x2: -100 + i * 33.3, y2: 50, class: "gl" }, g);
                for (let i = 1; i < 3; i++) mk("line", { x1: -100, y1: -50 + i * 33.3, x2: 100, y2: -50 + i * 33.3, class: "gl" }, g);
            }
            if (c[1] === "box") mk("text", { class: "bx", y: 6, "text-anchor": "middle" }, g).textContent = "NiyoGuard";
            const pin = mk("g", { class: "pin", transform: "translate(" + (-rw / 2 + 4) + "," + (-rh / 2 + 4) + ")" }, g);
            mk("circle", { r: 10 }, pin);
            mk("text", { y: 4, "text-anchor": "middle" }, pin).textContent = n;
            return g;
        };
        if (c[1] === "pair") {
            make(ex - 50, ey, 173, 330, 44, 44, "circle");
            make(ex + 50, ey, 387, 330, 44, 44, "circle");
        } else {
            make(ex, ey, ax, ay, w, hh);
        }
        const lb = mk("g", { class: "lb", "data-k": k, transform: "translate(" + ex + "," + (ey + (c[1] === "pair" ? 22 : hh / 2) + 18) + ")", style: "transition-delay:" + delay }, labels);
        mk("text", { class: "l1", "text-anchor": "middle" }, lb).textContent = c[0];
        mk("text", { class: "l2", y: 16, "text-anchor": "middle" }, lb).textContent = row[2];
    });
    const focus = (k) => {
        xs.classList.toggle("hl", k !== null);
        $$("#xs [data-k]").forEach((el) => el.classList.toggle("on", el.dataset.k === k));
    };
    xs.addEventListener("pointerover", (e) => {
        const t = e.target.closest("[data-k]");
        if (t && xs.classList.contains("ex")) focus(t.dataset.k);
    });
    xs.addEventListener("pointerleave", () => focus(null));
    xs.addEventListener("focusin", (e) => {
        const t = e.target.closest("[data-k]");
        if (t) focus(t.dataset.k);
    });
    xs.addEventListener("focusout", () => focus(null));
};
buildX();
const setX = (on) => {
    xs.classList.toggle("ex", on);
    xs.classList.remove("hl");
    $$("#xs .on").forEach((el) => el.classList.remove("on"));
    xb.textContent = on ? "Assemble" : "Explode";
};
xb.addEventListener("click", () => setX(!xs.classList.contains("ex")));
let xt = 0;
new MutationObserver(() => {
    clearTimeout(xt);
    const d = $("#parts");
    if (!d.open) return;
    setX(false);
    xt = setTimeout(() => setX(!reduce), 500);
}).observe($("#parts"), { attributes: true, attributeFilter: ["open"] });
