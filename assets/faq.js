/* Open the linked answer when arriving from the FAQ index or a shared link. */
(function () {
  function openAnswer() {
    let id; try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const answer = document.getElementById(id);
    if (!answer?.matches('.faq details')) return;
    answer.open = true;
    answer.scrollIntoView({block:'start'});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', openAnswer);
  else openAnswer();
  window.addEventListener('hashchange', openAnswer);
})();
