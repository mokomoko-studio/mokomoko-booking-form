(() => {
  "use strict";

  const form = document.querySelector("#booking-form");
  const submitButton = document.querySelector("#submit-button");
  const responseFrame = document.querySelector("#google-form-response");
  const successPanel = document.querySelector("#success");
  let submitting = false;

  const fieldRules = [
    { key: "pet-name", selector: "#pet-name", message: "請填寫毛孩暱稱。" },
    { key: "pet-type", selector: 'input[name="entry.1815331256"]:checked', message: "請選擇毛孩品種。", other: "#pet-type-other" },
    { key: "age", selector: "#age", message: "請選擇毛孩歲數。" },
    { key: "notes", selector: 'input[name="entry.622904434"]:checked', message: "請選擇或填寫備註。", other: "#notes-other" },
    { key: "instagram", selector: "#instagram", message: "請填寫飼主 Instagram 帳號。" },
    { key: "source", selector: 'input[name="entry.474112390"]:checked', message: "請選擇認識 MOKOMOKO 的平台。", other: "#source-other" },
    { key: "confirmation", selector: 'input[name="entry.1086373769"]:checked', message: "請確認已瞭解聯繫方式。" },
  ];

  function setFieldError(key, message = "") {
    const field = form.querySelector(`[data-field="${key}"]`);
    const error = form.querySelector(`#${key}-error`);
    field?.classList.toggle("has-error", Boolean(message));
    if (error) error.textContent = message;
  }

  function validateField(rule) {
    const control = form.querySelector(rule.selector);
    let valid = Boolean(control);

    if (control && (control.matches("input[type='text'], textarea, select"))) {
      valid = control.value.trim() !== "";
    }

    if (valid && rule.other && control?.value === "__other_option__") {
      valid = form.querySelector(rule.other)?.value.trim() !== "";
    }

    setFieldError(rule.key, valid ? "" : rule.message);
    return valid;
  }

  function validateForm() {
    const invalid = fieldRules.filter((rule) => !validateField(rule));
    if (invalid.length > 0) {
      const firstField = form.querySelector(`[data-field="${invalid[0].key}"]`);
      firstField?.scrollIntoView({ behavior: "smooth", block: "center" });
      const firstControl = firstField?.querySelector("input:not([disabled]), select, textarea:not([disabled])");
      window.setTimeout(() => firstControl?.focus({ preventScroll: true }), 250);
      return false;
    }
    return true;
  }

  function syncOtherInput(radio) {
    const group = radio.name;
    form.querySelectorAll(`input[name="${group}"][data-other-target]`).forEach((otherRadio) => {
      const input = document.getElementById(otherRadio.dataset.otherTarget);
      const active = otherRadio.checked;
      input.disabled = !active;
      input.required = active;
      if (!active) input.value = "";
    });
  }

  form.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) return;
    if (target.type === "radio") syncOtherInput(target);
    const field = target.closest("[data-field]");
    const rule = fieldRules.find((item) => item.key === field?.dataset.field);
    if (rule) validateField(rule);
  });

  form.addEventListener("input", (event) => {
    const field = event.target.closest?.("[data-field]");
    const rule = fieldRules.find((item) => item.key === field?.dataset.field);
    if (rule && field.classList.contains("has-error")) validateField(rule);
  });

  form.addEventListener("submit", (event) => {
    if (submitting || !validateForm()) {
      event.preventDefault();
      return;
    }

    submitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "送出中…";
    form.setAttribute("aria-busy", "true");

    window.setTimeout(() => {
      if (!submitting) return;
      submitting = false;
      submitButton.disabled = false;
      submitButton.textContent = "重新送出";
      form.removeAttribute("aria-busy");
      setFieldError("confirmation", "目前無法確認送出結果，請檢查網路後再試一次。");
    }, 15000);
  });

  responseFrame.addEventListener("load", () => {
    if (!submitting) return;
    submitting = false;
    form.hidden = true;
    form.removeAttribute("aria-busy");
    successPanel.hidden = false;
    successPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

})();
