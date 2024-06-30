const Observer = {
  start() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.observe());
      return;
    }
    this.observe();
  },

  observe() {
    const selectors = [
      '[class*=" intersect:"]',
      '[class*=":intersect:"]',
      '[class^="intersect:"]',
      '[class="intersect"]',
      '[class*=" intersect "]',
      '[class^="intersect "]',
      '[class$=" intersect"]',
    ];

    document.querySelectorAll(selectors.join(",")).forEach((element) => {
      const intersectClass = Array.from(element.classList).find((className) =>
        className.startsWith("intersect-")
      );
      const [vertical, offset] = this.parseIntersectClass(intersectClass || "");
      let option;

      if (vertical === "top") {
        option = {
          threshold: 0,
          rootMargin: `0px 0px -${100 - offset}% 0px`,
        };
      } else if (vertical === "bottom") {
        option = {
          threshold: 1,
          rootMargin: `0px 0px -${offset}% 0px`,
        };
      } else {
        option = {
          threshold: 0,
          rootMargin: `0px 0px -${100 - 85}% 0px`,
        };
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            element.setAttribute("no-intersect", "");

            return;
          }

          element.removeAttribute("no-intersect");

          element.classList.contains("intersect-once") && observer.disconnect();
        });
      }, option);

      observer.observe(element);
    });
  },

  parseIntersectClass(className) {
    const defaultConfig = ["top", "100"];
    const match = className.match(/intersect-(top|bottom)-(\d+)/);

    if (!match) {
      return defaultConfig;
    }

    console.log("className: ", className);

    const [, vertical, offset] = match;
    return [vertical, offset];
  },
};

export default Observer;
