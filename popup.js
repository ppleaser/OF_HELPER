document.addEventListener('DOMContentLoaded', async function () {
  const browserSwitches = [];
  let previousActiveSwitchIndex = null; // Индекс предыдущего активного переключателя

  // Функция для обновления состояния активных переключателей и отправки на сервер
  async function updateActiveBrowserCount() {
    // Проверяем, включен ли хотя бы один переключатель
    const anyBrowserActive = browserSwitches.some(switchElement => switchElement.checked);
    
    const activeSwitchIndex = browserSwitches.findIndex(switchElement => switchElement.checked);
    let countChange = 0;

    if (previousActiveSwitchIndex === null && anyBrowserActive) {
      countChange = 1; // Включаем первый переключатель
    } else if (previousActiveSwitchIndex !== null && !anyBrowserActive) {
      countChange = -1; // Отключаем последний переключатель
    }

    // Отправляем изменение на сервер, только если оно есть
    if (countChange !== 0) {
      const response = await fetch('http://localhost:3000/update-count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ count: countChange })
      });

      if (!response.ok) {
        console.error('Error sending POST request:', response);
      }
    }

    // Обновляем индекс предыдущего активного переключателя
    previousActiveSwitchIndex = activeSwitchIndex !== -1 ? activeSwitchIndex : null;
  }

  for (let i = 1; i <= 15; i++) { 
    const browserSwitch = document.getElementById(`browserSwitch${i}`);
    browserSwitches.push(browserSwitch);

    const storageKey = `browser${i}Checked`;
    const storageResult = await chrome.storage.sync.get([storageKey]);
    browserSwitch.checked = storageResult[storageKey] || false;

    if (browserSwitch.checked) {
      previousActiveSwitchIndex = i - 1; // Запоминаем индекс активного переключателя при загрузке
    }

    browserSwitch.addEventListener('change', async function () {
      if (this.checked) {
        browserSwitches.forEach((switchElement, index) => {
          if (switchElement !== this && switchElement.checked) {
            switchElement.checked = false;
            chrome.storage.sync.set({ [`browser${index + 1}Checked`]: false });
          }
        });
      }

      const storageUpdates = {};
      for (let j = 1; j <= 15; j++) { 
        storageUpdates[`browser${j}Checked`] = browserSwitches[j - 1].checked;
      }

      await chrome.storage.sync.set(storageUpdates);

      // Обновляем состояние активных переключателей и отправляем на сервер при изменении переключателей
      await updateActiveBrowserCount();

      if (this.checked) {
        const response = await fetch('http://localhost:3000/clear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });

        if (!response.ok) {
          console.error('Error sending POST request:', response);
        }
      }
    });
  }

  const storageResult = await chrome.storage.sync.get(['postChecked', 'fakeChecked']);

  if (storageResult.postChecked === undefined || storageResult.postChecked === true) {
    await chrome.storage.sync.set({'postChecked': true});
  }

  if (storageResult.fakeChecked === undefined || storageResult.fakeChecked === true) {
    await chrome.storage.sync.set({'fakeChecked': true});
  } 
  await updateActiveBrowserCount();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getActiveBrowserCount') {
    const activeBrowserCount = browserSwitches.filter(switchElement => switchElement.checked).length;
    sendResponse({ activeBrowserCount });
  }
});