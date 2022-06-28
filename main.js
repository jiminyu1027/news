let url;
let news = [];
let page = 1;
let total_pages = 0;
let searchBtn = document.getElementById("search-btn");

let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) => {
  menu.addEventListener("click", (event) => {
    newsTopic(event);
  });
});


const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "wqh-ChN44N2keUbGWHsYH6PC7cqeXrKTvOKYm7cDmH8",
    });
    url.searchParams.set("page", page);

    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다");
      }
      total_pages = data.total_pages;
      page = data.page;
      news = data.articles;
      console.log(news);
      render();
      pagenation();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log(error.message);
    errorRender(error.message);
  }
};

const latestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`
  );
  getNews();
};

const newsTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${topic}&countries=KR&page_size=10`
  );
  getNews();
};

const getKeyword = async () => {
  let keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
  );
  getNews();
};

const render = () => {
  let newsHTML = ``;
  newsHTML = news
    .map((item) => {
      return `<div class="row news">
                <div class="col-lg-4">
                  <img class="news-img" src="${
                    item.media ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
                  }" />
                </div>
                <div class="col-lg-8">
                  <h2>${item.title}</h2>
                  <p>
                    ${
                      item.summary == null || item.summary == ""
                        ? "내용없음"
                        : item.summary.length > 200
                        ? item.summary.substring(0, 200) + "..."
                        : item.summary
                    }
                  </p>
                  <div>${item.rights || "no source"} * ${moment(
        item.published_date
      ).fromNow()}</div>
                </div>
              </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${message}
</div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

const pagenation = () => {
  let pagenationHTML = ``;
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  if (last > total_pages) {
    last = total_pages;
  }
  let first = last - 4 <= 0 ? 1 : last - 4;

  if (first >= 6) {
    pagenationHTML = `<li class="page-item" onclick="moveToPage(${1})">
                        <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                      </li>
                      <li class="page-item" onclick="moveToPage(${page - 1})">
                        <a class="page-link" href='#js-bottom'>&lt;</a>
                      </li>`;
  }
  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${i == page ? "active" : ""}" >
                        <a class="page-link" href='#js-bottom' onclick="moveToPage(${i})" >${i}</a>
                       </li>`;
  }

  if (last < total_pages) {
    pagenationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})">
                        <a  class="page-link" href='#js-bottom'>&gt;</a>
                       </li>
                       <li class="page-item" onclick="moveToPage(${total_pages})">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`;
  }

  document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  console.log(page);
  getNews();
};

searchBtn.addEventListener("click", getKeyword);
latestNews();
