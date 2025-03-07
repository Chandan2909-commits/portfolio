
  // Get the modal and button elements
  const modal = document.getElementById("resumeModal");
  const resumeBtn = document.getElementById("resumeBtn");
  const closeBtn = document.querySelector("#resumeModal .close");

  // Open modal when RESUME button is clicked
  resumeBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Close modal when the close button is clicked
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal if user clicks outside the modal content
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
  const timeline = new Timeliner({
    onUpdate: (progress) => {
      document.querySelectorAll('.timeline-item').forEach((item, index) => {
        const delay = index * 0.2;
        item.style.opacity = progress > delay ? 1 : 0;
        item.style.transform = `translateY(${progress > delay ? 0 : 50}px)`;
      });
    }
  });

