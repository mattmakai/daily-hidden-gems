(() => {
  const key = "turkey-guide-theme";
  const system = matchMedia("(prefers-color-scheme: dark)");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  let preference;
  let control;

  try {
    preference = localStorage.getItem(key);
  } catch {
    // The switch also works when the browser disables local storage.
  }

  function applyTheme() {
    const dark = preference === "dark" || (preference !== "light" && system.matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    themeColor.content = dark ? "#211c19" : "#faf7ef";
    if (control) control.checked = dark;
  }

  applyTheme();
  system.addEventListener("change", applyTheme);
  window.addEventListener("storage", (event) => {
    if (event.key === key || event.key === null) {
      preference = event.newValue;
      applyTheme();
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    control = document.getElementById("dark-mode");
    applyTheme();
    control.addEventListener("change", () => {
      preference = control.checked ? "dark" : "light";
      applyTheme();
      try {
        localStorage.setItem(key, preference);
      } catch {
        // Keep the current page in the chosen theme.
      }
    });
  });
})();
