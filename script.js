async function init() {
  const year = new Date().getFullYear();
  document.getElementById("year").textContent = year;

  const config = await fetch("config.json").then(r => r.json());

  document.getElementById("name").textContent = config.name;
  document.getElementById("bio").textContent = config.bio;
  document.getElementById("footer-name").textContent = config.name;
  document.getElementById("github-link").href = `https://github.com/${config.github}`;

  const repoList = document.getElementById("repo-list");
  repoList.textContent = "Cargando proyectos...";

  try {
    const res = await fetch(`https://api.github.com/users/${config.github}/repos`);
    const repos = await res.json();
    
    const filteredRepos = repos.filter(repo => 
      repo.name !== config.github && 
      repo.name.toLowerCase() !== 'portfolio'
    );

    repoList.innerHTML = "";

    for (const repo of filteredRepos) {
      // Obtener los lenguajes del repositorio
      let languagesHTML = '';
      try {
        const langRes = await fetch(repo.languages_url);
        const languages = await langRes.json();
        const langNames = Object.keys(languages);
        
        if (langNames.length > 0) {
          languagesHTML = langNames.map(lang => 
            `<span class="pr-3 text-gray-400">${lang}</span>`
          ).join('');
        } else {
          languagesHTML = '<span class="pr-3 text-gray-400">Desconocido</span>';
        }
      } catch (err) {
        languagesHTML = '<span class="pr-3 text-gray-400">Error</span>';
      }

      const card = document.createElement("div");
      card.className = "bg-gray-800 p-5 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200";
      card.innerHTML = `
        <h3 class="text-lg font-semibold mb-2">
          <a href="${repo.html_url}" target="_blank" class="text-blue-400 hover:text-blue-300 transition-colors duration-200">${repo.name}</a>
        </h3>
        <p class="text-gray-300">${repo.description || "Sin descripción"}</p>
        <p class="text-sm text-gray-400 mt-3 flex items-center gap-2">
          <span>⭐ ${repo.stargazers_count}</span>
          <span class="w-1 h-1 bg-gray-600 rounded-full"></span>
          ${languagesHTML}
        </div>
        
      `;
      repoList.appendChild(card);
    }
  } catch (err) {
    repoList.textContent = "Error al cargar proyectos.";
  }
}

init();
