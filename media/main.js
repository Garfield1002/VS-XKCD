(function () {
  document
    .getElementById("linkToFirst")
    .addEventListener("click", getFirstComic);
  document
    .getElementById("linkToLast")
    .addEventListener("click", getLatestComic);
  document.getElementById("linkToPrev").addEventListener("click", getPrevComic);
  document.getElementById("linkToNext").addEventListener("click", getNextComic);
  document.getElementById("linkToRnd").addEventListener("click", getRndComic);

  let LATEST_NUM;
  fetch("https://xkcd.vercel.app/?comic=latest")
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      LATEST_NUM = res.num;
      num = res.num;
      updateComic(num, res.title, res.img, res.alt);
    });

  function updateComic(num, title, img, alt) {
    document.querySelector("#ctitle").innerHTML = title;
    document.querySelector("#cimage").src = img;
    document.querySelector("#cimage").title = alt;
    document.querySelector(
      "#clink"
    ).innerHTML = `Permanent link to this comic: <a href="https://xkcd.com/${num}/">https://xkcd.com/${num}/</a>`;
  }

  function getFirstComic() {
    getComic("1");
  }

  function getLatestComic() {
    getComic("latest");
  }

  function getNextComic() {
    getComic(Math.min(num + 1, LATEST_NUM));
  }

  function getPrevComic() {
    getComic(Math.max(num - 1, 1));
  }

  function getRndComic() {
    getComic(Math.floor(Math.random() * LATEST_NUM + 1));
  }

  function getComic(query) {
    const comicUrl = `https://xkcd.vercel.app/?comic=${query}`;

    fetch(comicUrl)
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        num = res.num;
        updateComic(num, res.title, res.img, res.alt);
      });
  }
})();
