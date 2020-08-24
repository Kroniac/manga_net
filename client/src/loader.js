let counter = 0;
let timeout;
function onDocumentReady() {
  document.getElementById('index-pre-loader-counter-wrapper').style.display = 'none';
  clearInterval(timeout);
  document.removeEventListener('DOMContentLoaded', onDocumentReady);
}

document.addEventListener('DOMContentLoaded', onDocumentReady);

function loading() {
  let num = 0;

  // eslint-disable-next-line no-loop-func
  timeout = setInterval(() => {
    if (document.getElementById('index-loader-counter')) {
      num += 1;
      document.getElementById('index-loader-counter').innerHTML = `${num}%`;
    }
  }, 200);
}

setInterval(() => {
  if (counter === 9) {
    counter = 0;
  }

  counter += 1;
}, 30000);

loading();
