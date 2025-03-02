const API_KEY = '0f9c4e69a0724f6eaa86857417a7cc55';
const NEWS_API_URL = `https://newsapi.org/v2/everything?q=cybersecurity+cybercrime&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;

async function fetchNews() {
  const newsContent = document.getElementById('news-content');
  newsContent.innerHTML = '<div class="loader"></div>'; // Show loader

  try {
    const response = await fetch(NEWS_API_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.articles || data.articles.length === 0) {
      newsContent.innerHTML = '<p class="error">No cybercrime news found. Please check back later.</p>';
      return;
    }

    newsContent.innerHTML = '';
    
    const articlesToShow = data.articles.slice(0, 5);
    
    articlesToShow.forEach(article => {
      const newsItem = document.createElement('div');
      newsItem.className = 'news';
      newsItem.innerHTML = `
        <h3>${article.title}</h3>
        <p>date: "${formatDate(article.publishedAt)}",
        summary: "${article.description || 'No description available.'}",
        url: "${article.url}"
        </p>
      `;
      newsContent.appendChild(newsItem);
    });
  } catch (error) {
    console.error('Error fetching news:', error.message);
    
    newsContent.innerHTML = '';
    const fallbackNews = [
      {
        title: "Major Data Breach Affects Millions of Users",
        date: "2025-04-15",
        summary: "A popular social media platform reported a significant data breach exposing personal information of over 5 million users worldwide.",
        url: "#"
      },
      {
        title: "Ransomware Attack Targets Healthcare Systems",
        date: "2025-04-14",
        summary: "Several hospitals across the country are dealing with a sophisticated ransomware attack that has disrupted patient care services.",
        url: "#"
      },
      {
        title: "New Phishing Campaign Targets Banking Customers",
        date: "2025-04-13",
        summary: "Security researchers have identified a new phishing campaign specifically targeting customers of major banks with convincing fake emails.",
        url: "#"
      },
      {
        title: "Government Issues Warning About New Malware Strain",
        date: "2025-04-12",
        summary: "Cybersecurity agencies have issued an alert about a new malware strain capable of evading traditional detection methods.",
        url: "#"
      },
      {
        title: "Cryptocurrency Scams on the Rise",
        date: "2025-04-11",
        summary: "Authorities report a significant increase in cryptocurrency-related scams targeting inexperienced investors through social media platforms.",
        url: "#"
      }
    ];
    
    fallbackNews.forEach(news => {
      const newsItem = document.createElement('div');
      newsItem.className = 'news';
      newsItem.innerHTML = `
        <h3>${news.title}</h3>
        <p>date: "${news.date}",
        summary: "${news.summary}",
        url: "${news.url}"
        </p>
      `;
      newsContent.appendChild(newsItem);
    });
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Handle report form submission
function setupFormHandling() {
  const reportForm = document.getElementById('report-form');
  const submissionMessage = document.getElementById('submission-message');
  const newReportBtn = document.getElementById('new-report-btn');

  reportForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    setTimeout(() => {
      reportForm.classList.add('hidden');
      submissionMessage.classList.remove('hidden');
      reportForm.reset();
      submitBtn.textContent = 'Submit Report';
      submitBtn.disabled = false;
    }, 1500);
  });

  newReportBtn.addEventListener('click', function () {
    submissionMessage.classList.add('hidden');
    reportForm.classList.remove('hidden');
  });
}


function setupNewsRefreshEvent() {
  const refreshButton = document.getElementById('refresh-news-btn');
  if (refreshButton) {
    refreshButton.addEventListener('click', fetchNews);
  }
}

function isMobileDevice() {
  return window.innerWidth <= 768;
}


function adjustForMobile() {
  if (isMobileDevice()) {
    console.log('Mobile view activated.');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  fetchNews();
  setupFormHandling();
  setupNewsRefreshEvent(); // Changed from setupNewsRefresh()
  adjustForMobile();

  window.addEventListener('resize', adjustForMobile);
});