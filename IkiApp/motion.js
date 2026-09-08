function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

function sectorPath(cx, cy, r0, r1, a0, a1) {
  const [x0, y0] = polar(cx, cy, r1, a0)
  const [x1, y1] = polar(cx, cy, r1, a1)
  const [x2, y2] = polar(cx, cy, r0, a1)
  const [x3, y3] = polar(cx, cy, r0, a0)
  return `M ${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${r0} ${r0} 0 0 0 ${x3} ${y3} Z`
}

function wrapLabel(label) {
  if (label.length <= 12) return [label]
  const words = label.split(/\s+/)
  if (words.length === 1) return [label]
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")]
}

function initRodaDaVida() {
  const svg = document.getElementById("lp-roda")
  if (!svg) return

  const NS = "http://www.w3.org/2000/svg"
  const size = 680
  const cx = 340
  const cy = 340
  const inner = 52
  const outer = 176
  const slices = 12
  const rings = 10
  const step = (outer - inner) / rings
  const slice = 360 / slices
  const hues = [350, 20, 45, 70, 100, 140, 170, 200, 230, 260, 290, 320]
  const lang = (document.documentElement.lang || "pt").toLowerCase()
  const areas = lang.startsWith("en")
    ? [
        "Love",
        "Social",
        "Creativity",
        "Fulfillment",
        "Spirituality",
        "Health",
        "Growth",
        "Balance",
        "Achievement",
        "Finances",
        "Contribution",
        "Family",
      ]
    : [
        "Amoroso",
        "Social",
        "Criatividade",
        "Plenitude",
        "Espiritualidade",
        "Saúde",
        "Desenvolvimento",
        "Equilíbrio",
        "Realização",
        "Finanças",
        "Contribuição",
        "Família",
      ]
  const levels = new Array(slices).fill(0)
  const cells = []
  const labelEls = []

  while (svg.firstChild) svg.removeChild(svg.firstChild)

  for (let i = 0; i < slices; i++) {
    const a0 = i * slice + 0.4
    const a1 = (i + 1) * slice - 0.4
    const mid = (a0 + a1) / 2
    const group = document.createElementNS(NS, "g")
    const ringEls = []
    for (let r = 0; r < rings; r++) {
      const path = document.createElementNS(NS, "path")
      path.setAttribute(
        "d",
        sectorPath(cx, cy, inner + r * step, inner + (r + 1) * step, a0, a1),
      )
      path.setAttribute("stroke-linejoin", "round")
      group.appendChild(path)
      ringEls.push(path)
    }

    const [lx, ly] = polar(cx, cy, outer + 42, mid)
    const angle = ((mid % 360) + 360) % 360
    const anchor =
      Math.abs(angle) < 14 || Math.abs(angle - 180) < 14
        ? "middle"
        : angle < 180
          ? "start"
          : "end"
    const lines = wrapLabel(areas[i])
    const text = document.createElementNS(NS, "text")
    text.setAttribute("x", String(lx))
    text.setAttribute("y", String(ly - (lines.length - 1) * 6))
    text.setAttribute("text-anchor", anchor)
    text.setAttribute("dominant-baseline", "middle")
    text.setAttribute("pointer-events", "none")
    lines.forEach((line, li) => {
      const tspan = document.createElementNS(NS, "tspan")
      tspan.setAttribute("x", String(lx))
      tspan.setAttribute("dy", li === 0 ? "0" : "12")
      tspan.textContent = line
      text.appendChild(tspan)
    })
    group.appendChild(text)
    labelEls.push(text)

    svg.appendChild(group)
    cells.push(ringEls)
  }

  const hub = document.createElementNS(NS, "circle")
  hub.setAttribute("cx", String(cx))
  hub.setAttribute("cy", String(cy))
  hub.setAttribute("r", String(inner - 1))
  hub.setAttribute("fill", "none")
  hub.setAttribute("stroke", "rgba(88, 70, 140, 0.28)")
  hub.setAttribute("stroke-width", "1.2")
  hub.setAttribute("pointer-events", "none")
  svg.appendChild(hub)

  const paint = () => {
    for (let i = 0; i < slices; i++) {
      const hue = hues[i]
      const filled = levels[i]
      for (let r = 0; r < rings; r++) {
        const el = cells[i][r]
        const on = r < filled
        const shift = r * 0.032
        if (on) {
          el.setAttribute("fill", `oklch(${0.78 - shift} 0.19 ${hue})`)
          el.setAttribute("stroke", `oklch(0.58 0.12 ${hue} / 0.28)`)
          el.setAttribute("stroke-width", "0.55")
        } else {
          el.setAttribute("fill", "rgba(255, 255, 255, 0.05)")
          el.setAttribute("stroke", "rgba(90, 72, 150, 0.16)")
          el.setAttribute("stroke-width", "0.5")
        }
      }
      const label = labelEls[i]
      if (label) {
        label.setAttribute(
          "fill",
          filled > 0 ? `oklch(0.38 0.13 ${hue})` : "#3a3168",
        )
      }
    }
  }

  const hit = (clientX, clientY) => {
    const rect = svg.getBoundingClientRect()
    if (rect.width < 8 || rect.height < 8) return null
    const x = ((clientX - rect.left) / rect.width) * size
    const y = ((clientY - rect.top) / rect.height) * size
    const dx = x - cx
    const dy = y - cy
    const dist = Math.hypot(dx, dy)
    if (dist < inner - 2 || dist > outer + 10) return null
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90
    deg = ((deg % 360) + 360) % 360
    const index = Math.floor(deg / slice) % slices
    const n = Math.min(
      rings,
      Math.max(1, Math.ceil((Math.min(dist, outer) - inner) / step)),
    )
    return { index, rings: n }
  }

  const apply = (clientX, clientY) => {
    const h = hit(clientX, clientY)
    if (!h) return
    if (levels[h.index] === h.rings) return
    levels[h.index] = h.rings
    paint()
  }

  paint()

  svg.addEventListener("pointerdown", (event) => {
    svg.setPointerCapture(event.pointerId)
    apply(event.clientX, event.clientY)
    event.preventDefault()
  })

  svg.addEventListener("pointermove", (event) => {
    apply(event.clientX, event.clientY)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  initRodaDaVida()

  const menuToggle = document.querySelector("[data-menu-toggle]")
  const menu = document.querySelector("[data-menu]")
  const main = document.querySelector("main")
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

  const setMenu = (open, restoreFocus = false) => {
    if (!menuToggle || !menu) return

    menu.dataset.open = String(open)
    menuToggle.setAttribute("aria-expanded", String(open))
    menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu")
    document.body.classList.toggle("menu-open", open)

    if ("inert" in HTMLElement.prototype && main) {
      main.inert = open
    }

    if (open) {
      menu.querySelector("a")?.focus()
    } else if (restoreFocus) {
      menuToggle.focus()
    }
  }

  menuToggle?.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true")
  })

  menu?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false)
  })

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
      setMenu(false, true)
    }
  })

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800 && menuToggle?.getAttribute("aria-expanded") === "true") {
      setMenu(false)
    }
  })

  const els = document.querySelectorAll(".reveal")
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"))
    return
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible")
          io.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  )
  els.forEach((el) => io.observe(el))
})
