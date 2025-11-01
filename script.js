// Theme Toggle
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

const currentTheme = localStorage.getItem('theme') || 'dark';
body.classList.add(currentTheme === 'light' ? 'light' : '');

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('light');
  const newTheme = body.classList.contains('light') ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
  toggleBtn.innerHTML = newTheme === 'light' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Contact Form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Message sent! (Demo - Real mein Formspree add karo)');
  e.target.reset();
});

// To-Do App (Pehle wala same rakh lo, yeh add karo if needed)
function addTask() {
  let task = document.getElementById("task").value;
  if (task === "") return;
  
  let li = document.createElement("li");
  li.innerHTML = `${task} <span onclick="this.parentElement.remove()" style="color:red; cursor:pointer;">❌</span>`;
  document.getElementById("list").appendChild(li);
  document.getElementById("task").value = "";
}