// ========================================
// TASK MANAGEMENT APP
// ========================================

class TaskManager {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    this.currentFilter = 'all';
    this.currentCategory = 'all';
    this.currentSort = 'date-newest';
    this.editingTaskId = null;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderTasks();
    this.updateStats();
    this.loadTheme();
  }

  setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
    
    // Task input
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTask();
    });
    
    document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
    document.getElementById('newTaskBtn').addEventListener('click', () => this.showTaskOptions());
    document.getElementById('cancelTaskBtn').addEventListener('click', () => this.hideTaskOptions());
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.getAttribute('data-filter');
        this.renderTasks();
      });
    });
    
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.getAttribute('data-category');
        this.renderTasks();
      });
    });
    
    // Sort button
    document.getElementById('sortBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      const dropdown = document.getElementById('sortDropdown');
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    
    document.querySelectorAll('.sort-option').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentSort = btn.getAttribute('data-sort');
        document.getElementById('sortDropdown').style.display = 'none';
        this.renderTasks();
      });
    });
    
    // Clear completed
    document.getElementById('clearCompletedBtn').addEventListener('click', () => this.clearCompleted());
    
    // Modal
    document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
    document.getElementById('cancelEditBtn').addEventListener('click', () => this.closeModal());
    document.getElementById('saveTaskBtn').addEventListener('click', () => this.saveTask());
    
    // Close modal on overlay click
    document.getElementById('taskModal').addEventListener('click', (e) => {
      if (e.target.id === 'taskModal') this.closeModal();
    });
    
    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#sortBtn') && !e.target.closest('#sortDropdown')) {
        document.getElementById('sortDropdown').style.display = 'none';
      }
    });
  }

  showTaskOptions() {
    document.getElementById('taskOptions').style.display = 'grid';
    document.getElementById('taskInput').focus();
  }

  hideTaskOptions() {
    document.getElementById('taskOptions').style.display = 'none';
    document.getElementById('taskInput').value = '';
    document.getElementById('taskCategory').value = 'work';
    document.getElementById('taskPriority').value = 'medium';
    document.getElementById('taskDueDate').value = '';
  }

  addTask() {
    const input = document.getElementById('taskInput');
    const title = input.value.trim();
    
    if (!title) {
      this.showNotification('Please enter a task title', 'error');
      return;
    }
    
    const task = {
      id: Date.now().toString(),
      title: title,
      category: document.getElementById('taskCategory').value,
      priority: document.getElementById('taskPriority').value,
      dueDate: document.getElementById('taskDueDate').value || null,
      notes: '',
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    this.tasks.unshift(task);
    this.saveTasks();
    this.renderTasks();
    this.updateStats();
    this.hideTaskOptions();
    input.value = '';
    this.showNotification('Task added successfully!', 'success');
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.renderTasks();
      this.updateStats();
    }
  }

  deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.saveTasks();
      this.renderTasks();
      this.updateStats();
      this.showNotification('Task deleted', 'info');
    }
  }

  editTask(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;
    
    this.editingTaskId = id;
    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskCategory').value = task.category;
    document.getElementById('editTaskPriority').value = task.priority;
    document.getElementById('editTaskDueDate').value = task.dueDate || '';
    document.getElementById('editTaskNotes').value = task.notes || '';
    document.getElementById('taskModal').classList.add('active');
  }

  saveTask() {
    if (!this.editingTaskId) return;
    
    const task = this.tasks.find(t => t.id === this.editingTaskId);
    if (!task) return;
    
    const title = document.getElementById('editTaskTitle').value.trim();
    if (!title) {
      this.showNotification('Task title cannot be empty', 'error');
      return;
    }
    
    task.title = title;
    task.category = document.getElementById('editTaskCategory').value;
    task.priority = document.getElementById('editTaskPriority').value;
    task.dueDate = document.getElementById('editTaskDueDate').value || null;
    task.notes = document.getElementById('editTaskNotes').value;
    
    this.saveTasks();
    this.renderTasks();
    this.closeModal();
    this.showNotification('Task updated successfully!', 'success');
  }

  closeModal() {
    document.getElementById('taskModal').classList.remove('active');
    this.editingTaskId = null;
  }

  clearCompleted() {
    const completedCount = this.tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
      this.showNotification('No completed tasks to clear', 'info');
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
      this.tasks = this.tasks.filter(t => !t.completed);
      this.saveTasks();
      this.renderTasks();
      this.updateStats();
      this.showNotification('Completed tasks cleared', 'success');
    }
  }

  getFilteredTasks() {
    let filtered = [...this.tasks];
    
    // Apply filter
    if (this.currentFilter === 'pending') {
      filtered = filtered.filter(t => !t.completed);
    } else if (this.currentFilter === 'completed') {
      filtered = filtered.filter(t => t.completed);
    } else if (this.currentFilter === 'high') {
      filtered = filtered.filter(t => t.priority === 'high' && !t.completed);
    }
    
    // Apply category
    if (this.currentCategory !== 'all') {
      filtered = filtered.filter(t => t.category === this.currentCategory);
    }
    
    // Apply sort
    filtered = this.sortTasks(filtered);
    
    return filtered;
  }

  sortTasks(tasks) {
    const sorted = [...tasks];
    
    switch (this.currentSort) {
      case 'date-newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'date-oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'priority-high':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return sorted.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      case 'priority-low':
        const priorityOrder2 = { high: 3, medium: 2, low: 1 };
        return sorted.sort((a, b) => priorityOrder2[a.priority] - priorityOrder2[b.priority]);
      case 'alphabetical':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  }

  renderTasks() {
    const tasksList = document.getElementById('tasksList');
    const filteredTasks = this.getFilteredTasks();
    
    if (filteredTasks.length === 0) {
      tasksList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-clipboard-list"></i>
          <h3>No tasks found</h3>
          <p>${this.currentFilter === 'all' ? 'Add a new task to get started!' : 'Try a different filter.'}</p>
        </div>
      `;
      return;
    }
    
    tasksList.innerHTML = filteredTasks.map(task => this.renderTask(task)).join('');
    
    // Attach event listeners
    filteredTasks.forEach(task => {
      document.getElementById(`checkbox-${task.id}`).addEventListener('change', () => this.toggleTask(task.id));
      document.getElementById(`edit-${task.id}`).addEventListener('click', () => this.editTask(task.id));
      document.getElementById(`delete-${task.id}`).addEventListener('click', () => this.deleteTask(task.id));
    });
    
    // Update page title
    this.updatePageTitle();
  }

  renderTask(task) {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
    const categoryIcons = {
      work: 'fa-briefcase',
      personal: 'fa-user',
      shopping: 'fa-shopping-cart',
      health: 'fa-heart',
      other: 'fa-ellipsis-h'
    };
    
    return `
      <div class="task-item ${task.completed ? 'completed' : ''}">
        <div class="task-checkbox ${task.completed ? 'completed' : ''}" id="checkbox-${task.id}">
          ${task.completed ? '<i class="fas fa-check"></i>' : ''}
        </div>
        <div class="task-content">
          <div class="task-header">
            <div class="task-title">${this.escapeHtml(task.title)}</div>
            <span class="task-priority ${task.priority}">${task.priority}</span>
            <span class="task-category">
              <i class="fas ${categoryIcons[task.category]}"></i> ${task.category}
            </span>
          </div>
          <div class="task-meta">
            ${task.dueDate ? `
              <div class="task-meta-item">
                <i class="fas fa-calendar"></i>
                <span class="task-due-date ${isOverdue ? 'overdue' : ''}">
                  ${this.formatDate(task.dueDate)} ${isOverdue ? '(Overdue)' : ''}
                </span>
              </div>
            ` : ''}
            <div class="task-meta-item">
              <i class="fas fa-clock"></i>
              <span>${this.formatRelativeDate(task.createdAt)}</span>
            </div>
            ${task.notes ? `
              <div class="task-meta-item">
                <i class="fas fa-sticky-note"></i>
                <span>Has notes</span>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="task-actions">
          <button class="task-action-btn edit" id="edit-${task.id}" title="Edit Task">
            <i class="fas fa-edit"></i>
          </button>
          <button class="task-action-btn delete" id="delete-${task.id}" title="Delete Task">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }

  updateStats() {
    const total = this.tasks.length;
    const pending = this.tasks.filter(t => !t.completed).length;
    const completed = this.tasks.filter(t => t.completed).length;
    
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('completedTasks').textContent = completed;
  }

  updatePageTitle() {
    const titles = {
      'all': 'All Tasks',
      'pending': 'Pending Tasks',
      'completed': 'Completed Tasks',
      'high': 'High Priority Tasks'
    };
    
    const categories = {
      'all': '',
      'work': ' - Work',
      'personal': ' - Personal',
      'shopping': ' - Shopping',
      'health': ' - Health',
      'other': ' - Other'
    };
    
    document.getElementById('pageTitle').textContent = 
      titles[this.currentFilter] + categories[this.currentCategory];
    
    const subtitle = this.getFilteredTasks().length === 0 
      ? 'No tasks match your filters' 
      : `${this.getFilteredTasks().length} task(s) found`;
    document.getElementById('pageSubtitle').textContent = subtitle;
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateThemeIcon(newTheme);
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);
  }

  updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  formatRelativeDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      info: '#3b82f6'
    };
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${colors[type] || colors.info};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
    `;
    
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
      </div>
    `;
    
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TaskManager();
});

