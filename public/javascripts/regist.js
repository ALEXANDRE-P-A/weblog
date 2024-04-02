const submitForm = document.getElementById("submit_form");
const btn_submit = document.querySelectorAll("input[type='submit']");

btn_submit.forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    submitForm.setAttribute("method",btn.getAttribute("data-method"));
    submitForm.setAttribute("action",btn.getAttribute("data-action"));
    submitForm.submit();
    submitForm.setAttribute("method", "");
    submitForm.setAttribute("action", "");
    submitForm.addEventListener("submit", e => {
      e.stopPropagation();
      e.preventDefault();
    });
    btn_submit.forEach(btn => {
      btn.disabled = true;
    });
  });
});