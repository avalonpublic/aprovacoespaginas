document.addEventListener("DOMContentLoaded", () => {
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
