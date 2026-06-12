async function loadProjects(featuredOnly = false) {
  const container = document.getElementById('projects-container');
  if (!container) return;

  try {
    const response = await fetch('projects.json');
    const projects = await response.json();

    let filteredProjects = projects;
    if (featuredOnly) {
      filteredProjects = projects.filter(p => p.featured === true);
    }

    container.innerHTML = filteredProjects.map((project, index, array) => createProjectCard(project, index, array.length)).join('');
    console.log("👍🏽");

  } catch (error) {
    console.error('❌ خطأ في تحميل المشاريع:', error);
    container.innerHTML = '<p class="text-red-400 text-center p-8">عذراً، حدث خطأ في تحميل المشاريع.</p>';
  }
}

function createProjectCard(project, index, total) {
  const isEven = project.id % 2 === 0;
  
  let imageColumnClass = '';
  let textColumnClass = '';

  if (project.id % 2 === 1) {
    imageColumnClass = '';
    textColumnClass = 'order-last lg:order-first';
  } else {
    imageColumnClass = 'lg:order-last';
    textColumnClass = '';
  }

  const conceptBadge = project.concept ? `
    <span class="absolute top-4 left-4 z-20 px-3 py-1 text-xs rounded-full bg-purple-900/80 text-purple-200 border border-purple-400/30">
      مشروع مقترح – Concept Design
    </span>
  ` : '';

  const linkText = project.concept ? 'عرض النموذج' : 'زيارة الموقع';
  const linkIcon = getIconForLink(project.link);

  return `
    <!-- تم إزالة fade-up من هنا -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <!-- عمود الصورة -->
      <div class="glass rounded-2xl overflow-hidden aspect-square relative group ${imageColumnClass}">
        <div class="absolute inset-0 bg-[#6808F8]/20 group-hover:bg-transparent transition-colors z-10"></div>
        ${conceptBadge}
        <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover">
      </div>

      <!-- عمود النص -->
      <div class="${textColumnClass}">
        <h3 class="text-2xl font-bold mb-2 text-white">${project.title}</h3>
        <p class="text-purple-400 text-sm mb-4">${project.description || project.category}</p>

        <div class="space-y-4 mb-6">
          <div>
            <strong class="block text-gray-300 text-sm">التحدي:</strong>
            <p class="text-gray-400 text-sm">${project.challenge}</p>
          </div>
          <div>
            <strong class="block text-gray-300 text-sm">الحل:</strong>
            <p class="text-gray-400 text-sm">${project.solution}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full bg-purple-900/50 text-xs text-purple-300 border border-purple-500/20">
            ${project.tag}
          </span>

          <a href="${project.link}" target="_blank"
             class="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-purple-600 hover:bg-purple-700 transition text-white">
            <i class="fa-solid ${linkIcon}"></i>
            ${linkText}
          </a>
        </div>
      </div>
    </div>
    ${index < total - 1 ? '<div class="mx-auto my-12 w-2/3 h-0.5 rounded-full bg-white opacity-10"></div>' : ''}
  `;
}

function getIconForLink(link) {
  if (link.includes('souqspare')) return 'fa-magnifying-glass';
  if (link.includes('lally')) return 'fa-heart';
  return 'fa-arrow-up-right-from-square';
}

// التحميل التلقائي
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  const path = window.location.pathname;
  const isIndexPage = path.endsWith('index.html') || path === '/' || path.endsWith('/');
  loadProjects(isIndexPage);
});