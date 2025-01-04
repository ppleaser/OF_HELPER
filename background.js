const DELAY_AFTER_OPENING_NEW_TAB = 900
const DELAY_BEFORE_OPENING_NEW_TAB = 400
const ALL_ACTIONS_MONITOR = 200
const DELAY_GREEN_BUTTON = 500
const FAKE_SS_DELAY = 100

// Для MacOS (поменяйте цифры выше на примерно такие): 
// const DELAY_AFTER_OPENING_NEW_TAB = 1500
// const DELAY_BEFORE_OPENING_NEW_TAB = 800
// const ALL_ACTIONS_MONITOR = 200
// const DELAY_GREEN_BUTTON = 500
// const FAKE_SS_DELAY = 300
// :) 

console.error = function() {};

async function executeScriptIfValid(activeTab, details) {
  if (activeTab && !activeTab.url.startsWith('chrome://')) {
    await chrome.scripting.executeScript(details);
  }
}

let timerVisibility = true
let onlyFansOpenTabs = new Set(); 
let closedTabIds = new Set();
let closedTabsCount = 0; 
let lastClosedTime = null; 

function updateTabCounterOnActiveTab(isReset) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length === 0) return;
      const activeTab = tabs[0];
      let onlyFansTabsCount = onlyFansOpenTabs.size;

      if (!timerVisibility) {
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: () => {
                const tabCounter = document.getElementById('tabCounter');
                const cont1 = document.getElementById('cont1');
                const cont2 = document.getElementById('cont2');
                const cont3 = document.getElementById('cont3');
    
                // Скрываем элементы
                [tabCounter, cont1, cont2, cont3].forEach(el => {
                    if (el) {
                        el.style.opacity = '0';
                        el.style.pointerEvents = 'none';
                    }
                });
            }
        }).catch(err => console.error('Error executing script:', err));
    } else {
        chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            func: () => {
                const tabCounter = document.getElementById('tabCounter');
                const cont1 = document.getElementById('cont1');
                const cont2 = document.getElementById('cont2');
                const cont3 = document.getElementById('cont3');
    
                // Возвращаем элементы в исходное состояние
                [tabCounter, cont1, cont2, cont3].forEach(el => {
                    if (el) {
                        el.style.opacity = '1'; // Сделать видимыми
                        el.style.pointerEvents = 'auto'; // Включить события указателя
                    }
                });
            }
        }).catch(err => console.error('Error executing script:', err));
    }


      let timeSinceLastClosed = "00:00";
      let color = "green"; 

      if (isReset) {
          lastClosedTime = new Date();
          closedTabsCount = 0;
      }

      if (lastClosedTime) { 
          const now = new Date();
          const diffMs = now - lastClosedTime;
          const diffSecs = Math.floor(diffMs / 1000);
          const minutes = String(Math.floor((diffSecs % 3600) / 60)).padStart(2, '0');
          const seconds = String(diffSecs % 60).padStart(2, '0');
          timeSinceLastClosed = `${minutes}:${seconds}`;

          if (diffSecs < 15) {
              color = "#2D9B37";
          } else if (diffSecs >= 15 && diffSecs < 30) {
              color = "yellow";
          } else {
              color = "#DD6D55";

              chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                  if (request.action === 'closeTab' && sender.tab) {
                      if (!closedTabIds.has(tabId)) {
                        closedTabIds.add(sender.tab.id);
                      }
                      chrome.tabs.remove(sender.tab.id);
                  }
              });
            
            function checkAndCloseTab() {

              function pressBind() {
                let intervalId = setInterval(function() {
                let selector = document.querySelector('[at-attr="submit_post"]') || document.querySelector("#content > div.l-wrapper > div > div > div > div > div.g-page__header.m-real-sticky.js-sticky-header.m-nowrap > div > button");
                const secondTargetNode  = document.querySelector('.b-reminder-form.m-error');
                const innerDiv = secondTargetNode ? secondTargetNode.querySelector('div') : null;
                if (innerDiv) {
                  if (innerDiv.textContent.includes('Internal') || innerDiv.textContent.includes('Nothing') || innerDiv.textContent.includes('Daily') || innerDiv.textContent.includes('Attached')) { 
                      clearInterval(intervalId);  
                      return; 
                  }
                }
                if (selector && !selector.disabled) {
                    selector.click();
                    setTimeout(function() {
                        let buttons = document.querySelectorAll('button.g-btn.m-flat.m-btn-gaps.m-reset-width');
                        buttons.forEach(function(button) {
                            if (button.textContent.trim() === "Yes") {
                                button.click();
                                clearInterval(intervalId); 
                                return;
                            }
                        });
                    }, 500); 
                  }  
                }, 5000);
              }

              const editor = document.querySelector('.tiptap.ProseMirror');
              if (editor) {
                  const isEmpty = editor.getAttribute('data-is-empty') === 'true';
                  if (isEmpty) {
                      chrome.runtime.sendMessage({ action: 'closeTab' });
                  }
                  else { 
                    let errorElement = document.querySelector('.b-reminder-form.m-error');
                    if (errorElement) {
                      return;
                    }
                    else {
                      if (!window.isPressBindRunning) {
                        pressBind()
                        window.isPressBindRunning = true;
                      }
                    }
                  }
              }
            }
            chrome.tabs.query({ url: "https://onlyfans.com/*" }, function(tabs) {

            chrome.tabs.query({ active: true, currentWindow: true }, function(activeTabs) {
                const activeTabId = activeTabs[0].id;
                const tabId = tabs[0].id;
                const tabUrl = tabs[0].url;
                if (tabs.length >= 30 && tabUrl === "https://onlyfans.com/posts/create" && tabId != activeTabId) { 
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        function: checkAndCloseTab
                    });         
                }
                if (tabUrl.startsWith("https://onlyfans.com") && tabUrl !== "https://onlyfans.com/posts/create" && tabs.length >= 5 && tabId != activeTabId) {
                    if (!closedTabIds.has(tabId)) {
                      closedTabIds.add(sender.tab.id);
                    }
                    chrome.tabs.remove(tabId);
                }
              });
          });
        }
      }

      chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: (count, closedCount, timeSinceClosed, color) => {
              const updateCounter = () => {
                  let tabCounter = document.getElementById('tabCounter');
                  if (!tabCounter) {
                      tabCounter = document.createElement("div");
                      tabCounter.id = 'tabCounter';
                      tabCounter.style.position = "fixed";
                      tabCounter.style.bottom = "50px";
                      tabCounter.style.left = "20px";
                      tabCounter.style.fontFamily = "'Josefin Sans', sans-serif";
                      tabCounter.style.fontSize = '20px';
                      tabCounter.style.padding = "10px";
                      tabCounter.style.borderRadius = "5px";
                      tabCounter.style.zIndex = "99999";
                      document.body.appendChild(tabCounter);
                  }
                  tabCounter.style.color = color; // Устанавливаем цвет текста
                  tabCounter.textContent = `${count} / ${closedCount} / ${timeSinceClosed}`;
              };

              if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', updateCounter);
              } else {
                  updateCounter();
              }
          },
          args: [onlyFansTabsCount, closedTabsCount, timeSinceLastClosed, color]
      }).catch(err => console.error('Error executing script:', err));
  });
}

function openNewTab() {
  chrome.runtime.sendMessage({action: "openNewTab"});
}

async function toggleColors() {

  const button = document.querySelector('button[at-attr="submit_post"]');
  if (button) {
      button.style.backgroundColor = 'rgba(138,150,163,.75)';
      button.style.opacity = '.4';
  }

  const element = document.querySelector('.g-btn.m-flat.m-link.m-default-font-weight.m-no-uppercase.m-reset-width.b-dot-item');
  if (element) {
    element.style.opacity = '.4';
  }

  const anotherElement = document.querySelector('.g-btn.m-btn-icon.m-reset-width.m-flat.m-with-round-hover.m-size-sm-hover');
  if (anotherElement) {
    anotherElement.style.opacity = '.4';
  }

  const elements = document.querySelectorAll('.b-dropzone__preview__delete.g-btn.m-rounded.m-reset-width.m-thumb-r-corner-pos.m-btn-remove.m-sm-icon-size');
  elements.forEach(element => {
    element.style.opacity = '.4';
    element.style.background = 'rgba(138, 150, 163, .75)';
  });
}

async function instantPostOn() {
  await chrome.storage.sync.set({ 'postChecked': true });
  const button = document.getElementById('instantPost');
  button.style.background = "#2D9B37";
}

async function instantPostOff() {
  await chrome.storage.sync.set({ 'postChecked': false });
  const button = document.getElementById('instantPost');
  button.style.background = "#DD6D55";
}

async function fakeColorsOn() {
  await chrome.storage.sync.set({ 'fakeChecked': true });
  const button = document.getElementById('fakeButton');
  button.style.background = "#6E8C6E"; // Зеленый с серым
}

async function fakeColorsOff() {
  await chrome.storage.sync.set({ 'fakeChecked': false });
  const button = document.getElementById('fakeButton');
  button.style.background = "#8C6E6E"; // Красный с серым
}

async function searchPosts() {
  const fileUrl = chrome.runtime.getURL('server/files/tags.txt');
  const response = await fetch(fileUrl);
  const text = await response.text();
  const lines = text.split('\n').filter(line => line.trim() !== '');

  const usernameDiv = document.querySelector('.g-user-username');
  if (usernameDiv) {
    const username = usernameDiv.innerText;
    const baseUrl = 'https://onlyfans.com/';
    const searchUrl = '/search/posts?q=';

    for (const line of lines) {
      const url = `${baseUrl}${line}${searchUrl}${username}`;
      const newTab = window.open(url, '_blank');
      /*
      newTab.addEventListener('DOMContentLoaded', () => {
        const observer = new MutationObserver((mutationsList, observer) => {
          const button = newTab.document.querySelector('.m-rounded.m-flex.m-space-between.g-btn');
          if (button) {
            button.click();
            observer.disconnect(); 
          }
        });

        observer.observe(newTab.document.body, { childList: true, subtree: true });
      });
      */
    }
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'checkModelsResult') {
    console.log("Data from checkModels:", message.data);
      try {
        const response = await fetch("http://localhost:3000/checkModels", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message.data)
        });
        if (response.ok) {
          console.log("Data sent successfully to the server");
        } else {
          console.error("Failed to send data to the server");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
})
 
async function checkModels() {
  async function outputElements(newTab) {
    const usernameElements = newTab.document.querySelectorAll('.g-user-username');
    const username = usernameElements.length >= 2 ? usernameElements[1].textContent : "-";
    let fanCountElement = newTab.document.querySelector('svg[data-icon-name="icon-follow"]');
    const fanCount = fanCountElement ? fanCountElement.nextElementSibling.textContent.trim() : 'closed Fans';
    
    setTimeout(() => {
      const currentMonthElement = newTab.document.querySelector('.vdatetime-calendar__current--month');
      const currentMonth = currentMonthElement ? currentMonthElement.textContent : "-";
      let firstActiveDay = newTab.document.querySelector('.vdatetime-calendar__month__day:not(.vdatetime-calendar__month__day--disabled)');
      let firstActiveDayNumber = firstActiveDay ? firstActiveDay.querySelector('span span').textContent : '-';
      chrome.runtime.sendMessage({ type: 'checkModelsResult', data: { username, currentMonth, firstActiveDayNumber, fanCount } });
    }, 1000);
  }

  const fileUrl = chrome.runtime.getURL('server/files/tags.txt');
  const response = await fetch(fileUrl);
  const text = await response.text();
  const lines = text.split('\n').filter(line => line.trim() !== '');

  for (const line of lines) {
    const url = `https://onlyfans.com/${line}`;
    const newTab = window.open(url, '_blank');

    const checkDOM = setInterval(() => {
      if (newTab.document.readyState !== 'loading') {
        clearInterval(checkDOM);

        let subscribeButtonClicked = false;
        let dropdownButtonClicked = false;

        const observer = new MutationObserver(async (mutationsList, observer) => {
          for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
              const subscribeButton = newTab.document.querySelector(".m-rounded.m-flex.m-space-between.m-lg.g-btn");
              const dropdownButton = newTab.document.querySelector('.btn.dropdown-toggle.g-btn.m-gray.m-with-round-hover.m-icon.m-icon-only.m-sm-size');

              if (subscribeButton && !dropdownButtonClicked && !dropdownButton && !subscribeButtonClicked) {
                subscribeButtonClicked = true
                setTimeout(() => {
                  subscribeButton.click();
                  setTimeout(() => {
                    const newDropdownButton = newTab.document.querySelector('.btn.dropdown-toggle.g-btn.m-gray.m-with-round-hover.m-icon.m-icon-only.m-sm-size');
                    if (newDropdownButton) {
                      newDropdownButton.click();
                      dropdownButtonClicked = true;

                      setTimeout(() => {
                        const goToDateLabel = newTab.document.querySelector('label[for="filter-go-to-date"]');
                        if (goToDateLabel) {
                          goToDateLabel.click();
                        }

                        setTimeout(async () => {
                          let days = Array.from(newTab.document.querySelectorAll('.vdatetime-calendar__month .vdatetime-calendar__month__day'));
                          days = days.filter(day => !day.classList.contains('vdatetime-calendar__month__day--disabled'));

                          while (days.length > 0) {
                            const previousButton = newTab.document.querySelector('.vdatetime-calendar__navigation--previous');
                            if (previousButton) {
                              previousButton.click();
                              await new Promise(resolve => setTimeout(resolve, 100));
                            }
                            days = Array.from(newTab.document.querySelectorAll('.vdatetime-calendar__month .vdatetime-calendar__month__day'));
                            days = days.filter(day => !day.classList.contains('vdatetime-calendar__month__day--disabled'));
                          }

                          const nextButton = newTab.document.querySelector('.vdatetime-calendar__navigation--next');
                          if (nextButton) {
                            nextButton.click();
                            setTimeout(async () => {
                              await outputElements(newTab);
                              newTab.close();
                              observer.disconnect();
                            }, 500);
                          }
                        }, 500);
                      }, 3000);
                    }
                  }, 9000);
                }, 5000);
              }

              if (dropdownButton && !dropdownButtonClicked) {
                dropdownButtonClicked = true;
                setTimeout(() => {
                  dropdownButton.click();
                  setTimeout(() => {
                    const goToDateLabel = newTab.document.querySelector('label[for="filter-go-to-date"]');
                    if (goToDateLabel) {
                      goToDateLabel.click();
                    }

                    setTimeout(async () => {
                      let days = Array.from(newTab.document.querySelectorAll('.vdatetime-calendar__month .vdatetime-calendar__month__day'));
                      days = days.filter(day => !day.classList.contains('vdatetime-calendar__month__day--disabled'));

                      while (days.length > 0) {
                        const previousButton = newTab.document.querySelector('.vdatetime-calendar__navigation--previous');
                        if (previousButton) {
                          previousButton.click();
                          await new Promise(resolve => setTimeout(resolve, 100));
                        }
                        days = Array.from(newTab.document.querySelectorAll('.vdatetime-calendar__month .vdatetime-calendar__month__day'));
                        days = days.filter(day => !day.classList.contains('vdatetime-calendar__month__day--disabled'));
                      }

                      const nextButton = newTab.document.querySelector('.vdatetime-calendar__navigation--next');
                      if (nextButton) {
                        nextButton.click();
                        setTimeout(async () => {
                          await outputElements(newTab);
                          newTab.close();
                          observer.disconnect();
                        }, 500);
                      }
                    }, 500);
                  }, 500);
                }, 5000);
              }
            }
          }
        });
        observer.observe(newTab.document.body, { childList: true, subtree: true });
      }
    }, 100);
  }
}


async function clearPosts() {

  var button1 = document.querySelector('a[data-name="Statements"][href="/my/statements/"]');
  if (button1) {
      button1.click();
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  var button2 = document.querySelector('a[data-name="PostsCreate"][href="/posts/create"]');
  if (button2) {
      button2.click();
  }

  await new Promise(resolve => {
      const observer = new MutationObserver((mutationsList, observer) => {
          for (let mutation of mutationsList) {
              if (mutation.type === 'childList') {
                  var button3 = document.querySelector("#content > div.l-wrapper > div.l-wrapper__holder-content.m-inherit-zindex > div > div > div > div.g-page__header.m-real-sticky.js-sticky-header.m-nowrap > div > button.m-btn-clear-draft.g-btn.m-border.m-rounded.m-sm-width.m-reset-width");
                  if (button3) {
                      button3.click();
                      location.reload();
                      observer.disconnect();
                      resolve();
                  }
              }
          }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
          observer.disconnect();
          resolve();
      }, 5000);
  });
}

function clickOnNewPost() {
  const anchorElement = document.querySelector(
    'a[data-name="PostsCreate"][href="/posts/create"]',
  );
  if (anchorElement) {
    anchorElement.click();
  }
}

function clearPhotoBindSingle() {
  let elements = document.querySelectorAll('.b-dropzone__preview__delete.g-btn.m-rounded.m-reset-width.m-thumb-r-corner-pos.m-btn-remove.m-sm-icon-size.has-tooltip');
  let divs = document.querySelectorAll("#make_post_form > div.b-make-post.m-with-free-options > div > div.b-make-post__main-wrapper > div.b-make-post__media-wrapper > div > div > div > div > div > div")
  divs.forEach(function(div) {
    if (elements.length > 0 && div.contains(elements[elements.length - 1])) {
        elements[elements.length - 1].click();
    }
  });
}

function clearPhotoBindAll() {
  let elements = document.querySelectorAll('.b-dropzone__preview__delete.g-btn.m-rounded.m-reset-width.m-thumb-r-corner-pos.m-btn-remove.m-sm-icon-size.has-tooltip');
  let divs = document.querySelectorAll("#make_post_form > div.b-make-post.m-with-free-options > div > div.b-make-post__main-wrapper > div.b-make-post__media-wrapper > div > div > div > div > div > div")
  divs.forEach(function(div) {
    elements.forEach(function(element) {
        if (div.contains(element)) {
            element.click();
        }
    });
  });
}

async function pasteBind() {
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  document.body.appendChild(tempContainer);

  // Функция для вставки медиа из буфера обмена во временный элемент
  const pasteToTempContainer = async () => {
    return new Promise((resolve) => {
      const tempElement = document.createElement('div');
      tempElement.contentEditable = true;
      tempContainer.appendChild(tempElement);
      tempElement.focus();

      const pasteHandler = async (e) => {
        e.preventDefault();
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;

        for (let item of items) {
          if (item.type.indexOf('image/') === 0 || 
              item.type.indexOf('video/') === 0 || 
              item.type === 'image/gif') {
            
            const blob = item.getAsFile();
            const media = item.type.indexOf('image/') === 0 
              ? document.createElement('img')
              : document.createElement('video');

            if (media instanceof HTMLVideoElement) {
              media.controls = true;
              media.autoplay = false;
            }

            const blobUrl = URL.createObjectURL(blob);
            media.src = blobUrl;
            tempElement.appendChild(media);
          }
        }
        
        setTimeout(() => {
          resolve();
        }, 500);
      };

      tempElement.addEventListener('paste', pasteHandler);
      document.execCommand('paste');
    });
  };

  // Улучшенная функция для симуляции drag-and-drop
  const simulateDragAndDrop = (sourceElement, targetElement) => {
    const dataTransfer = new DataTransfer();

    // Ищем медиа элементы (изображения или видео)
    const mediaElement = sourceElement.querySelector('img, video');

    if (mediaElement) {
      // Конвертируем медиа в blob
      const convertMediaToBlob = async (element) => {
        if (element instanceof HTMLImageElement) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = element.naturalWidth;
          canvas.height = element.naturalHeight;
          ctx.drawImage(element, 0, 0);
          return new Promise(resolve => canvas.toBlob(resolve));
        } else if (element instanceof HTMLVideoElement) {
          const response = await fetch(element.src);
          return response.blob();
        }
      };

      convertMediaToBlob(mediaElement).then(blob => {
        const fileExtension = mediaElement instanceof HTMLImageElement ? 'png' : 'mp4';
        const mimeType = mediaElement instanceof HTMLImageElement ? 'image/png' : 'video/mp4';
        const file = new File([blob], `media.${fileExtension}`, { type: mimeType });
        
        dataTransfer.items.add(file);

        // Симуляция событий drag-and-drop
        const events = [
          new DragEvent('dragstart', {
            bubbles: true,
            cancelable: true,
            dataTransfer: dataTransfer
          }),
          new DragEvent('dragover', {
            bubbles: true,
            cancelable: true,
            dataTransfer: dataTransfer
          }),
          new DragEvent('drop', {
            bubbles: true,
            cancelable: true,
            dataTransfer: dataTransfer
          })
        ];

        // Последовательно запускаем события
        sourceElement.dispatchEvent(events[0]);
        setTimeout(() => {
          targetElement.dispatchEvent(events[1]);
          setTimeout(() => {
            targetElement.dispatchEvent(events[2]);
          }, 100);
        }, 100);
      });
    }
  };

  // Вставка медиа во временный элемент
  await pasteToTempContainer();

  // Находим элементы
  const tempElement = tempContainer.querySelector('div[contenteditable="true"]');
  const targetElement = document.querySelector('.tiptap.ProseMirror.b-text-editor.js-text-editor.m-native-custom-scrollbar.m-scrollbar-y.m-scroll-behavior-auto.m-overscroll-behavior-auto');
                                                

  if (targetElement && tempElement) {
    simulateDragAndDrop(tempElement, targetElement);
  } else {
    console.error('Target element or temporary element not found');
  }

  // Очистка
  setTimeout(() => {
    document.body.removeChild(tempContainer);
  }, 1000);
}

async function createBrowser(browserType, index, totalIndex, repeat) {

  async function fetchWithRetry(resource, options, timeout = 5000, retries = 5) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
  
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(resource, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (e) {
            if (e.name === 'AbortError') {
                console.log(`Fetch timed out. Retrying (${i + 1}/${retries})...`);
            } else {
                throw e;
            }
        }
    }
    throw new Error('Fetch failed after retries');
  }

  let number = parseInt(browserType.replace(/\D/g, ''));
  if (index == 0 || repeat == true) {
    fetchWithRetry('http://localhost:3000/create-browser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            totalIndex: totalIndex,
            number: number,
            repeat: repeat
        }),
    }, 5000).catch(e => console.error(e));
  }
}

async function addTextToPost(text, imageUrl, index, browserType, exp, txt, pht) {

  async function fetchWithRetry(resource, options, timeout = 5000, retries = 5) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
  
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(resource, {
          ...options,
          signal: controller.signal
        });
        clearTimeout(id);
        return response;
      } catch (e) {
        if (e.name === 'AbortError') {
          console.log(`Fetch timed out. Retrying (${i + 1}/${retries})...`);
        } else {
          throw e;
        }
      }
    }
    throw new Error('Fetch failed after retries');
  }

  function simulateDragAndDrop(sourceElement, targetElement, file) {
    const dataTransfer = new DataTransfer();
    
    // Добавляем файл в dataTransfer
    dataTransfer.items.add(file);
    // Симуляция события dragstart
    const dragStartEvent = new DragEvent('dragstart', {
        bubbles: true,
        cancelable: true,
        dataTransfer: dataTransfer
    });
    sourceElement.dispatchEvent(dragStartEvent);

    // Задержка перед событием dragover
    setTimeout(() => {
        const dragOverEvent = new DragEvent('dragover', {
            bubbles: true,
            cancelable: true,
            dataTransfer: dataTransfer
        });
        targetElement.dispatchEvent(dragOverEvent);

        // Задержка перед событием drop
        setTimeout(() => {
            const dropEvent = new DragEvent('drop', {
                bubbles: true,
                cancelable: true,
                dataTransfer: dataTransfer
            });
            targetElement.dispatchEvent(dropEvent);

            const dragEndEvent = new DragEvent('dragend', {
              bubbles: true,
              cancelable: true,
              dataTransfer: dataTransfer
          });
          sourceElement.dispatchEvent(dragEndEvent);
        }, 100); 
    }, 100);
}

let isUploading = false;

async function handleImageUpload(pht) {
  if (isUploading) return;
  isUploading = true;
  let number = parseInt(browserType.replace(/\D/g, ''));
  
  const fileExtension = imageUrl.split('.').pop().toLowerCase();
  let fileType = 'image/png';
  let mediaElement;

  if (fileExtension === 'gif') {
    fileType = 'image/gif';
    mediaElement = new Image();
  } else if (fileExtension === 'mp4') {
    fileType = 'video/mp4';
    mediaElement = document.createElement('video');
  } else {
    mediaElement = new Image();
  }

  mediaElement.src = imageUrl;
  
  mediaElement.onload = mediaElement.onloadedmetadata = async function () {
    try {
      if (pht) {
        const mediaBlob = await fetch(imageUrl).then(res => res.blob());
        const file = new File([mediaBlob], `media.${fileExtension}`, { type: fileType });
        let mediaInserted = false;

        await new Promise((resolve) => {
          const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
              if (mutation.type === 'childList') {
                let el = document.querySelector(".b-make-post__media-wrapper");
                if (el && !mediaInserted) {
                  mediaInserted = true;
                  clearInterval(intervalId);
                  isUploading = false;
                  resolve();
                  observer.disconnect();
                }
              }
            }
          });

          observer.observe(document.body, { childList: true, subtree: true });

          let dragAttempts = 0;

          const intervalId = setInterval(function () {
            let element = document.querySelector('.tiptap.ProseMirror.b-text-editor.js-text-editor.m-native-custom-scrollbar.m-scrollbar-y.m-scroll-behavior-auto.m-overscroll-behavior-auto');
            let el = document.querySelector(".b-make-post__media-wrapper");

            if (element && !el && dragAttempts === 0 && !mediaInserted) {
              element.focus();
              simulateDragAndDrop(mediaElement, element, file);
              mediaInserted = true;
              dragAttempts++;
            }

            setTimeout(function () {
              el = document.querySelector(".b-make-post__media-wrapper");
              if (el || dragAttempts >= 2) {
                mediaInserted = true;
                clearInterval(intervalId);
                isUploading = false;
                resolve();
                observer.disconnect();
              }
            }, 500);
          }, 200);
        });
      }
      await fetchWithRetry('http://localhost:3000/update-browser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          index: index,
          number: number
        }),
      }, 5000);
    } catch (e) {
      console.log(e);
      await fetchWithRetry('http://localhost:3000/update-browser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          index: index,
          number: number
        }),
      }, 5000);
    }
  };

  // Обработка ошибок загрузки медиа
  mediaElement.onerror = function() {
    console.error('Ошибка загрузки медиафайла');
    isUploading = false;
  };
}

  const clickEvent = new Event("click", {
    bubbles: true,
    cancelable: true,
  });

  var checkButton = setInterval(async function() {
    const button = document.querySelector(".b-make-post__expire-period-btn");
    if (button) {
      clearInterval(checkButton);
      if (imageUrl) {
        await handleImageUpload(pht);
     }

      setTimeout(async () => {
        const textarea = document.querySelector('.tiptap.ProseMirror'); // Adjust the selector to match your element
        if (textarea) {
          if (txt) {
          const formattedText = text.split('\n').join('<br>');
          textarea.innerHTML = `<p>${formattedText}</p>`; // Set the inner HTML
          }
           
          if (exp) {
          setTimeout(async () => {
          const button_fix = document.querySelector(".b-make-post__expire-period-btn");
              button_fix.dispatchEvent(clickEvent);
          }, 500);
          const observer = new MutationObserver(async (mutationsList, observer) => {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const button2 = document.querySelector("#ModalPostExpiration___BV_modal_body_ > div.b-tabs__nav.m-nv.m-tab-rounded.m-reset-mb.m-single-current > ul > li:nth-child(2) > button")
                    if (button2) {
                        button2.dispatchEvent(clickEvent);
        
                        const button3 = document.querySelector(
                            "#ModalPostExpiration___BV_modal_footer_ > button:nth-child(2)",
                        );
                        if (button3) {
                            button3.dispatchEvent(clickEvent);
                        }
        
                        observer.disconnect();
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        }
        } 
      }, 500);
    }
  }, 200);
}

function addTimeToPost(textInput, isApart, browserType) {

try {

  const clickEvent = new Event("click", {
    bubbles: true,
    cancelable: true,
  });

  function checkButtonsAndContinue() {
    const button1 = document.querySelector(".g-btn.m-with-round-hover.m-icon.m-icon-only.m-gray.m-sm-size.b-make-post__datepicker-btn");
    const button2 = document.querySelector('.g-btn.m-with-round-hover.m-icon.m-icon-only.m-gray.m-sm-size.b-make-post__datepicker-btn.has-tooltip');
    
    if (button1 || button2) {
      clearInterval(intervalId);
      continueExecution(textInput);
    }
  }

  function continueExecution(textInput) {
  let closeButton = document.querySelector("#make_post_form > div.b-make-post > div > div.b-dropzone__previews.b-make-post__schedule-expire-wrapper.g-sides-gaps > div.b-post-piece.b-dropzone__preview.m-schedule.m-loaded.g-pointer-cursor.m-row > button")
    if (closeButton) {
      closeButton.dispatchEvent(clickEvent);
  }
  
  if (textInput === "0" && (!isApart || browserType === "browser1")) {
    return
  }

  if (textInput === "n") {
    textInput = "0"
  }

  const button1 = document.querySelector(".g-btn.m-with-round-hover.m-icon.m-icon-only.m-gray.m-sm-size.b-make-post__datepicker-btn.has-tooltip")
  if (button1) {
    button1.dispatchEvent(clickEvent);
  }
  else {
    const button10 = document.querySelector(".g-btn.m-with-round-hover.m-icon.m-icon-only.m-gray.m-sm-size.b-make-post__datepicker-btn")
    button10.dispatchEvent(clickEvent);
  }

  let currentDate = new Date();

  let monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];

  let currentMonthIndex = currentDate.getMonth();

  let nextMonthIndex = (currentMonthIndex + 1) % 12;
  var nextMonthName = monthNames[nextMonthIndex];

  let currentDayOfMonth = currentDate.getDate();
  let currentTimeInHours = currentDate.getHours();
  let currentTimeInMinutes = currentDate.getMinutes();

  let period = "";
  let hours = 0;
  let newHours = 0;
  let newMinutes = "";

  let nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + 1);

  let nextDayOfMonth = nextDate.getDate();

  let dayAfterTomorrow = new Date(currentDate);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  let dayAfterTomorrowDayOfMonth = dayAfterTomorrow.getDate();

  if (textInput.includes('-')) {
    var parts = textInput.split('-');
    var textInput = parseInt(parts[0]);
    newMinutes = parseInt(parts[1]);
    newMinutes = currentTimeInMinutes + newMinutes + 10

    if (newMinutes >= 60) {
        newMinutes -= 60;
        if (currentTimeInMinutes <= 50)
          textInput += 1;
    }
    if (newMinutes < 10) {
        newMinutes = "0" + newMinutes;
    }

    textInput = textInput.toString();
    newMinutes = newMinutes.toString();
  }

  if (textInput.length === 1 || textInput.length === 2 || textInput.length === 3) {

    hours = currentTimeInHours + parseInt(textInput);

    if (isApart) {
      let number = parseInt(browserType.replace(/\D/g, ''));
      hours = hours + number - 1
    }

    if (hours > 24) {
      const additionalDays = Math.floor(hours / 24);
      let futureDate = new Date(currentDate);
      let currentMonth = currentDate.getMonth();
      
      futureDate.setDate(futureDate.getDate() + additionalDays);
      currentDayOfMonth = futureDate.getDate();
      newHours = hours % 24;
  
      if (currentTimeInMinutes >= 50) {
          newHours = newHours + 1;
          if (newHours === 24) {
              newHours = 0;
              futureDate.setDate(futureDate.getDate() + 1);
              currentDayOfMonth = futureDate.getDate();
          }
      }
  
      if (newHours === 0) {
          newHours = 12;
          period = "a";
      } else if (newHours === 12) {
          period = "s";
      } else if (newHours < 12) {
          period = "a";
      } else {
          newHours = newHours - 12;
          period = "s";
      }
  
      setTimeout(() => {
          const next = document.querySelector(
              "#make_post_form > div.vdatetime.b-datepicker-input.custom-datepicker > div > div.vdatetime-popup.m-vdatetime-tabs > div.vdatetime-popup__body > div > div.vdatetime-calendar__navigation > div.vdatetime-calendar__navigation--next"
          );
          
          const currentMonthElement = document.querySelector(
              "#make_post_form > div.vdatetime.b-datepicker-input.custom-datepicker > div > div.vdatetime-popup.m-vdatetime-tabs > div.vdatetime-popup__body > div > div.vdatetime-calendar__navigation > div.vdatetime-calendar__current--month"
          );
  
          // Проверяем существование элементов
          if (next && currentMonthElement) {
              // Проверяем, изменился ли месяц
              if (futureDate.getMonth() !== currentMonth) {
                  next.dispatchEvent(clickEvent);
              }
          }
      }, 1000);
  }

   else if (hours === 24 || (currentTimeInMinutes >= 50 && hours === 23)) {
      
      currentDayOfMonth = currentDayOfMonth + 1;
      if (currentDayOfMonth !== nextDayOfMonth) {
        currentDayOfMonth = nextDayOfMonth;
         setTimeout(() => {
         const next = document.querySelector(
           "#make_post_form > div.vdatetime.b-datepicker-input.custom-datepicker > div > div.vdatetime-popup.m-vdatetime-tabs > div.vdatetime-popup__body > div > div.vdatetime-calendar__navigation > div.vdatetime-calendar__navigation--next",
         );
         let currentMonthElement = document.querySelector("#make_post_form > div.vdatetime.b-datepicker-input.custom-datepicker > div > div.vdatetime-popup.m-vdatetime-tabs > div.vdatetime-popup__body > div > div.vdatetime-calendar__navigation > div.vdatetime-calendar__current--month");
         let currentMonthName = currentMonthElement.innerText.split(" ")[0];
         if (nextMonthName !== currentMonthName) {
           next.dispatchEvent(clickEvent);
       }
       }, 1000);
      }

      newHours = 12;

      if (hours === 24 && currentTimeInMinutes >= 50) {
        newHours = 1
      }
      
      period = "a";
    } 
    
    
    else if (hours < 24 || (currentTimeInMinutes < 50 && hours === 23) ) {
      newHours = hours;

        
    if (currentTimeInMinutes >= 50) {
      newHours = newHours + 1
    }

      if (newHours < 12) {
        period = "a";
      }

      if (newHours == 12) {
        period = "s";
      }

      if (newHours == 0) {
        newHours = 12
      }

      if (newHours > 12) {
        newHours = newHours - 12;
        period = "s";
      }
    }
  } else if (textInput.length > 6) {
    let parts = textInput.split('_');
    if (parts.length === 3) {
        let getMonth = parseInt(parts[0]);
        currentDayOfMonth = parseInt(parts[1]);
        newHours = parseInt(parts[2].slice(0, -3));
        newMinutes = parts[2].slice(-3, -1)
        period = textInput[textInput.length - 1];
        let currentMonth = currentDate.getMonth() + 1
        let monthDifference = 0
        if (getMonth < currentMonth) {
          monthDifference =  12 - currentMonth + getMonth
        }
        else {
          monthDifference = getMonth - currentMonth 
        }
	    setTimeout(function() {
          const next3 = document.querySelector("#make_post_form > div.vdatetime.b-datepicker-input.custom-datepicker > div > div.vdatetime-popup.m-vdatetime-tabs > div.vdatetime-popup__body > div > div.vdatetime-calendar__navigation > div.vdatetime-calendar__navigation--next");
          let i = 0;
          function clickNext() {
              if (i < monthDifference) {
                  next3.dispatchEvent(clickEvent);
                  i++;
                  setTimeout(clickNext, 40);
              }
          }
          clickNext();
      }, 500);
    }
}
  else if (textInput.length === 5 || textInput.length === 6) {
    period = textInput[textInput.length - 1];
    let increment = (textInput[0] === "w") ? 1 : (textInput[0] === "e") ? 2 : 0;
    currentDayOfMonth += increment;

    let targetDayOfMonth = (increment === 1) ? nextDayOfMonth : (increment === 2) ? dayAfterTomorrowDayOfMonth : currentDayOfMonth;

    if (currentDayOfMonth !== targetDayOfMonth) {
     currentDayOfMonth = targetDayOfMonth;
      setTimeout(() => {
      const next = document.querySelector(
        "#make_post_form > div.vdatetime.b-datepicker-input.custom-datepicker > div > div.vdatetime-popup.m-vdatetime-tabs > div.vdatetime-popup__body > div > div.vdatetime-calendar__navigation > div.vdatetime-calendar__navigation--next",
      );
      let currentMonthElement = document.querySelector("#make_post_form > div.vdatetime.b-datepicker-input.custom-datepicker > div > div.vdatetime-popup.m-vdatetime-tabs > div.vdatetime-popup__body > div > div.vdatetime-calendar__navigation > div.vdatetime-calendar__current--month");
      let currentMonthName = currentMonthElement.innerText.split(" ")[0];
      if (nextMonthName !== currentMonthName) {
        next.dispatchEvent(clickEvent);
    }
    }, 1000);
  }
  }

  if (textInput.length === 5) {
    newHours = parseInt(textInput.substring(1, 2));
    newMinutes = textInput.substring(2, 4);
} else if (textInput.length === 6) {
    newHours = parseInt(textInput.substring(1, 3));
    newMinutes = textInput.substring(3, 5);
}

if (isApart && textInput.length !== 1 && textInput.length !== 2) {
    let number = parseInt(browserType.replace(/\D/g, ''));
    newHours = newHours + number - 1;
    
    // Если первая буква q (сегодня) и часы переходят за полночь
    if (textInput[0] === 'q' && newHours >= 12 && period === 's') {
        // Меняем на завтра (w)
        currentDayOfMonth = currentDayOfMonth + 1;
        if (currentDayOfMonth !== nextDayOfMonth) {
            currentDayOfMonth = nextDayOfMonth;
        }
        
        if (newHours != 12) {
          newHours = newHours - 12;
        }
        period = 'a';
    }
    // Если первая буква w (завтра) и часы переходят за полночь
    else if (textInput[0] === 'w' && newHours >= 12 && period === 's') {
        // Меняем на послезавтра (e)
        currentDayOfMonth = currentDayOfMonth + 2;
        if (currentDayOfMonth !== dayAfterTomorrowDayOfMonth) {
            currentDayOfMonth = dayAfterTomorrowDayOfMonth;
        }
        
        if (newHours != 12) {
          newHours = newHours - 12;
        }
        period = 'a';
    }
    // Для остальных случаев просто корректируем время
    else if (newHours > 12) {
        newHours = newHours - 12;
        if (period === 'a') {
            period = 's';
        }
    }
}

  setTimeout(() => {
      const divs = document.querySelectorAll(".vdatetime-calendar__month__day");
      for (const div of divs) {
        const span = div.querySelector("span span");
        if (span && parseInt(span.innerText) === currentDayOfMonth) {
          div.dispatchEvent(clickEvent);
        }
      }
  }, 1000);


  setTimeout(() => {

    const button4 = document.querySelector("#make_post_form > div.vdatetime.b-datepicker-input.custom-datepicker > div > div.vdatetime-popup.m-vdatetime-tabs > div.vdatetime-popup__tabs > div.vdatetime-popup__tab.time")
    if (button4) {
      button4.dispatchEvent(clickEvent);
    }
  }, 1000);

  setTimeout(() => {
    const container = document.querySelector(
      "#make_post_form > div.vdatetime.b-datepicker-input.custom-datepicker > div > div.vdatetime-popup.m-vdatetime-tabs > div.vdatetime-popup__body > div > div.vdatetime-time-picker__list.vdatetime-time-picker__list--suffix",
    );
    if (container) {
      const divs = container.querySelectorAll(
        ".vdatetime-time-picker__item",
      );

      for (const div of divs) {
        const text = div.innerText;
        if (text === "AM" && period === "a") {
          div.dispatchEvent(clickEvent);
        }
        if (text === "PM" && period === "s") {
          div.dispatchEvent(clickEvent);
        }
      }
    }
  }, 1000);

  setTimeout(() => {
    const container = document.querySelector(
      "#make_post_form > div.vdatetime.b-datepicker-input.custom-datepicker > div > div.vdatetime-popup.m-vdatetime-tabs > div.vdatetime-popup__body > div > div.vdatetime-time-picker__list.vdatetime-time-picker__list--hours",
    );

    if (container) {
      const divs = container.querySelectorAll(".vdatetime-time-picker__item");

      for (const div of divs) {
        const number = parseInt(div.innerText);

        if (!isNaN(number) && number === newHours) {
          div.dispatchEvent(clickEvent);

          if (newMinutes !== "") {

            setTimeout(() => {
              const container2 = document.querySelector("#make_post_form > div.vdatetime.b-datepicker-input.custom-datepicker > div > div.vdatetime-popup.m-vdatetime-tabs > div.vdatetime-popup__body > div > div.vdatetime-time-picker__list.vdatetime-time-picker__list--minutes")
              if (container2) {
                const divs = container2.querySelectorAll(
                  ".vdatetime-time-picker__item",
                );

                for (const div of divs) {
                  const text = div.innerText;
                  if (text === newMinutes) {
                    div.dispatchEvent(clickEvent);
                  }
                }
              }
            }, 200);
          }

         setTimeout(() => {
              const button5 = document.querySelector(
                "#make_post_form > div.vdatetime.b-datepicker-input.custom-datepicker > div > div.vdatetime-popup.m-vdatetime-tabs > div.vdatetime-popup__actions > div.vdatetime-popup__actions__button.vdatetime-popup__actions__button--confirm > button",
              );
              if (button5) {
                button5.click();
              } 
            }, 200);
            break;
        }
      }
    }
  }, 1000);
}
const intervalId = setInterval(checkButtonsAndContinue, 200);
}
catch (error) {
  console.log("Error: ", error)
}
}

function listenForButtonClicks(arg, tabId) {
  const button1 = document.querySelector("#content > div.l-wrapper > div.l-wrapper__holder-content.m-inherit-zindex > div > div > div > div.g-page__header.m-real-sticky.js-sticky-header.m-nowrap > div > button:nth-child(2)");
  const button2 = document.querySelector("#content > div.l-wrapper > div.l-wrapper__holder-content.m-inherit-zindex > div > div > div > div.g-page__header.m-real-sticky.js-sticky-header.m-nowrap > div > button");

  if (!button1 && !button2) {
    return;
  }

  let disabledCount = 0;
  let timeoutId = "";

  function clickPost(tabId) {
    const intervalId = setInterval(() => {
      const anchorElement = document.querySelector(
        'a[data-name="PostsCreate"][href="/posts/create"]',
      );
      if (anchorElement) {
        if (!anchorElement.classList.contains('m-disabled')) {
            anchorElement.click();
            if (tabId) {
              tabId = tabId.toString();
              chrome.storage.local.set({[tabId]: true});
          }
            clearInterval(intervalId);
        }
        else {
          disabledCount++;
          if (disabledCount >= 10) {
            clearInterval(intervalId);
          }
        }
      }
    }, 1000); 
  }

  function handleClick() {
    if (this._clickListenerAdded) {
      timeoutId = setTimeout(function() {
        clickPost(tabId);
    }, 500);
    }
  }

  function manageListener(button) {
    if (button) {
      if (arg === false) {
        if (timeoutId) clearTimeout(timeoutId);
        if (button._clickListenerAdded) {
          button.removeEventListener('click', handleClick);
          button._clickListenerAdded = false;
        }
      } else if (arg === true && !button._clickListenerAdded) {
        button.addEventListener('click', handleClick);
        button._clickListenerAdded = true;
      }
    }
  }
  [button1, button2].forEach(manageListener);
}

let lastTabId;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url === 'https://onlyfans.com/posts/create' && tabId !== lastTabId) {
      lastTabId = tabId;
      chrome.storage.local.get(['lastRequestTime'], function(result) {
          var lastRequestTime = result.lastRequestTime ? new Date(result.lastRequestTime) : null;
          var currentTime = new Date();
          var timeDifference = currentTime - lastRequestTime;
          if (!lastRequestTime || timeDifference >= 12 * 60 * 60 * 1000) { 
              chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  args: [currentTime.toString()],
                  function: function(currentTime) {
                      const observer = new MutationObserver(function() {
                          const usernameDiv = document.querySelector('.g-user-username');
                          if (usernameDiv) {
                              const username = usernameDiv.innerText;
                              if (username) {
                                  observer.disconnect();
                                  fetch('http://localhost:3000/checkInfo', {
                                      method: 'POST',
                                      headers: {
                                          'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({
                                          username: username
                                      }),
                                  })
                                  .then(response => {
                                      if (response.ok) {
                                          chrome.storage.local.set({lastRequestTime: currentTime});
                                      }
                                  })
                              }
                          }
                      });
                      observer.observe(document.body, { childList: true, subtree: true });
                  }
              });
          }
      });
  }
});

function sendActivityInfo(browser) {
  console.log(browser)
  fetch('http://localhost:3000/activity', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ browser }),
  })
  .then(response => response.text())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
}

async function checkDataFile() {
  const dataFileURL = chrome.runtime.getURL("server/files/data/data.json");
  const result = await chrome.storage.sync.get([
    "browser1Checked",
    "browser2Checked",
    "browser3Checked",
    "browser4Checked",
    "browser5Checked",
    "browser6Checked",
    "browser7Checked",
    "browser8Checked",
    "browser9Checked",
    "browser10Checked",
    "browser11Checked",
    "browser12Checked",
    "browser13Checked",
    "browser14Checked",
    "browser15Checked",
    "postChecked",
    "fixChecked"
  ]);

  const browser1 = result.browser1Checked;
  const browser2 = result.browser2Checked;
  const browser3 = result.browser3Checked;
  const browser4 = result.browser4Checked;
  const browser5 = result.browser5Checked;
  const browser6 = result.browser6Checked;
  const browser7 = result.browser7Checked;
  const browser8 = result.browser8Checked;
  const browser9 = result.browser9Checked;
  const browser10 = result.browser10Checked;
  const browser11 = result.browser11Checked;
  const browser12 = result.browser12Checked;
  const browser13 = result.browser13Checked;
  const browser14 = result.browser14Checked;
  const browser15 = result.browser15Checked;
  const instantPost = result.postChecked

  try {
    if (typeof instantPost === 'boolean') {
      chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
        const activeTab = currentWindow.tabs.find((tab) => tab.active);
        await executeScriptIfValid(activeTab, {
          target: { tabId: activeTab.id },
          func: listenForButtonClicks,
          args: [instantPost, activeTab.id],
        });
      });  
    }

    const response = await fetch(dataFileURL);
    const data = await response.json();

    let lastEntry = null;
    let lastIndex = -1;
    for (let i = 0; i < data.length; i++) {
      const entry = data[i];
      if (
        (browser1 && !entry.browser1) ||
        (browser2 && !entry.browser2) ||
        (browser3 && !entry.browser3) ||
        (browser4 && !entry.browser4) || 
        (browser5 && !entry.browser5) || 
        (browser6 && !entry.browser6) || 
        (browser7 && !entry.browser7) ||
        (browser8 && !entry.browser8) || 
        (browser9 && !entry.browser9) ||
        (browser10 && !entry.browser10) ||
        (browser11 && !entry.browser11) ||
        (browser12 && !entry.browser12) ||
        (browser13 && !entry.browser13) ||
        (browser14 && !entry.browser14) ||
        (browser15 && !entry.browser15) 
      ) {
        lastEntry = entry;
        lastIndex = i;
        break;
      }
    }

    let browserType = "";
    var isApart = false

    if (lastEntry) {
      if (browser1 && !lastEntry.browser1) {
        browserType = "browser1";
      } else if (browser2 && !lastEntry.browser2) {
        browserType = "browser2";
      } else if (browser3 && !lastEntry.browser3) {
        browserType = "browser3";
      } else if (browser4 && !lastEntry.browser4) {
        browserType = "browser4";
      } else if (browser5 && !lastEntry.browser5) {
        browserType = "browser5";
      } else if (browser6 && !lastEntry.browser6) {
        browserType = "browser6";
      } else if (browser7 && !lastEntry.browser7) {
      browserType = "browser7";
      } else if (browser8 && !lastEntry.browser8) {
      browserType = "browser8"; }
      else if (browser9 && !lastEntry.browser9) {
        browserType = "browser9"; }
      else if (browser10 && !lastEntry.browser10) {
        browserType = "browser10"; }
      else if (browser11 && !lastEntry.browser11) {
        browserType = "browser11"; }
      else if (browser12 && !lastEntry.browser12) {
        browserType = "browser12"; }
      else if (browser13 && !lastEntry.browser13) {
        browserType = "browser13"; }
      else if (browser14 && !lastEntry.browser14) {
        browserType = "browser14"; }
      else if (browser15 && !lastEntry.browser15) {
        browserType = "browser15"; }

      isApart = lastEntry.isApart
    }

      function validateDelete(answer) {
          const pattern = /^(del|вуд)-?\d+$/;
          return pattern.test(answer);
      }
      
      function validateSwitch(answer) {
        const pattern = /^(sw|ыц|іц)-?\d+$/;
        return pattern.test(answer);
      }

    function extractNumber(textInput) {
      const pattern = /-?\d+/;
      const match = textInput.match(pattern);
      return match ? Number(match[0]) : null;
    }

    if (lastEntry && lastEntry.id === "11" && browserType !== "") {
      await sendTypeToServer(lastIndex, browserType);
    
      chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
        const activeTab = currentWindow.tabs.find((tab) => tab.active);
        if (lastEntry.textInput === "clear") {
          await executeScriptIfValid(activeTab, {
            target: { tabId: activeTab.id },
            func: clearPosts,
          });
        }
        else if (lastEntry.textInput === "reset") {
          updateTabCounterOnActiveTab(true)
          return
        }
        else if (lastEntry.textInput === "hide") {
          timerVisibility = false
          return
        }
        else if (lastEntry.textInput === "show") {
          timerVisibility = true
          return
        }
        else if (lastEntry.textInput === "checkActivity") {
          sendActivityInfo(browserType)
          return
        }
        else if (lastEntry.textInput === "open") {
          await executeScriptIfValid(activeTab, {
            target: { tabId: activeTab.id },
            func: openNewTab,
          });
          return
        }
        else if (lastEntry.textInput === "check") {
          await executeScriptIfValid(activeTab, {
            target: { tabId: activeTab.id },
            func: checkModels,
          });
          return
        }
        else if (lastEntry.textInput === "search") {
          await executeScriptIfValid(activeTab, {
            target: { tabId: activeTab.id },
            func: searchPosts,
          });
          return
        }
        else if (validateDelete(lastEntry.textInput)) {
          const number = extractNumber(lastEntry.textInput);
          new Promise((resolve) => {
              chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
                  resolve(tabs[0].index);
              });
          }).then(currentTabIndex => {
              chrome.tabs.query({}, function(tabs) {
                  
                  let tabsToClose = [];
                  if (number > 0) {
                      tabsToClose = tabs.slice(currentTabIndex + 1, currentTabIndex + 1 + number)
                          .filter(tab => tab.url.startsWith('https://onlyfans.com')) // Фильтруем по URL
                          .map(tab => tab.id);
                  } else if (number < 0) {
                      tabsToClose = tabs.slice(Math.max(0, currentTabIndex + number), currentTabIndex)
                          .filter(tab => tab.url.startsWith('https://onlyfans.com')) // Фильтруем по URL
                          .map(tab => tab.id);
                  } else if (number === 0 && tabs.length > 1) {
                      if (tabs[currentTabIndex].url.startsWith('https://onlyfans.com')) {
                          chrome.tabs.remove(tabs[currentTabIndex].id);
                      }
                      return;
                  }
      
                  if (tabsToClose.length > 0) {
                      chrome.tabs.remove(tabsToClose);
                  }
              });
          });
      }
      else if (validateSwitch(lastEntry.textInput)) {
        const number = extractNumber(lastEntry.textInput);
        new Promise((resolve) => {
            chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
                resolve(tabs[0].index);
            });
        }).then(currentTabIndex => {
            chrome.tabs.query({}, function(tabs) {
                let targetIndex = number > 0 ? Math.min(tabs.length - 1, currentTabIndex + number) : 
                                number < 0 ? Math.max(0, currentTabIndex + number) : 
                                tabs.length > 1 ? 0 : currentTabIndex;
                while (targetIndex < tabs.length && !tabs[targetIndex].url.startsWith('https://onlyfans.com')) {
                    targetIndex++;
                }
                if (targetIndex < tabs.length) {
                    chrome.tabs.update(tabs[targetIndex].id, {active: true});
                }
            });
        });
    }
        else {
          await executeScriptIfValid(activeTab, {
            target: { tabId: activeTab.id },
            func: clickOnNewPost,
          });
        }
      });
    }
    
    if (lastEntry && lastEntry.id === "12" && browserType !== "") {

      await sendTypeToServer(lastIndex, browserType);
    
      const text = lastEntry.textInput;
      let exp = lastEntry.exp
      let txt = lastEntry.txt
      let pht = lastEntry.pht
      let addPhoto = lastEntry.addPhoto
      let imageUrl = '-'
      let index = 0
      let totalIndex = 0
      let repeat = lastEntry.repeat
      if (addPhoto) {
        index = lastEntry.index
        totalIndex = lastEntry.totalIndex
        let pattern = text.match(/@[a-zA-Z0-9._-]+/)[0];  // Берём только разрешенные символы после @
        pattern = pattern.substring(1);  // Убираем @
        if (pattern.endsWith('.')) {
            pattern = pattern.replace(/\.*$/, '');  // Убираем точку в конце
        }
        pattern = pattern.replace(/\./g, '-');  // Заменяем точки на дефисы
        console.log(pattern)
        async function findCorrectImageUrl(pattern) {
          const extensions = ["png", "gif", "mp4"];
          for (const ext of extensions) {
              const url = chrome.runtime.getURL(`server/crop/images/${pattern}.${ext}`);
              try {
                  const response = await fetch(url, { method: 'HEAD' });
                  if (response.ok) {
                      return url;
                  }
              } catch (e) {
                  continue;
              }
          }
      
          return null;
       }
      
        imageUrl = await findCorrectImageUrl(pattern);
        chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
          const activeTab = currentWindow.tabs.find((tab) => tab.active);
          await executeScriptIfValid(activeTab, {
            target: { tabId: activeTab.id },
            func: createBrowser,
            args: [browserType, index, totalIndex, repeat],
          });
        });
      }

      chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
        const activeTab = currentWindow.tabs.find((tab) => tab.active);
        await executeScriptIfValid(activeTab, {
          target: { tabId: activeTab.id },
          func: addTextToPost,
          args: [text, imageUrl, index, browserType, exp, txt, pht],
        });
      });
    }
    
    if (lastEntry && lastEntry.id === "14" && browserType !== "") {
      await sendTypeToServer(lastIndex, browserType);
    
      chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
        const activeTab = currentWindow.tabs.find((tab) => tab.active);
        await executeScriptIfValid(activeTab, {
          target: { tabId: activeTab.id },
          func: openNewTab,
        });
      });
    }

    if (lastEntry && lastEntry.id === "15" && browserType !== "") {
      await sendTypeToServer(lastIndex, browserType);
    
      chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
        const activeTab = currentWindow.tabs.find((tab) => tab.active);
        await executeScriptIfValid(activeTab, {
          target: { tabId: activeTab.id },
          func: pressBind,
        });
      });
    }

    if (lastEntry && lastEntry.id === "19" && browserType !== "") {
      await sendTypeToServer(lastIndex, browserType);
    
      chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
        const activeTab = currentWindow.tabs.find((tab) => tab.active);
        await executeScriptIfValid(activeTab, {
          target: { tabId: activeTab.id },
          func: pressBindFix,
          args: [activeTab],
        });
      });
    }

    if (lastEntry && lastEntry.id === "100" && browserType !== "") {
      await sendTypeToServer(lastIndex, browserType);
    
      chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
        const activeTab = currentWindow.tabs.find((tab) => tab.active);
        await executeScriptIfValid(activeTab, {
          target: { tabId: activeTab.id },
          func: instantPostOn,
        });
      });
    }

    if (lastEntry && lastEntry.id === "101" && browserType !== "") {
      await sendTypeToServer(lastIndex, browserType);
    
      chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
        const activeTab = currentWindow.tabs.find((tab) => tab.active);
        await executeScriptIfValid(activeTab, {
          target: { tabId: activeTab.id },
          func: instantPostOff,
        });
      });
    }

    if (lastEntry && lastEntry.id === "102" && browserType !== "") {
      await sendTypeToServer(lastIndex, browserType);
    
      chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
        const activeTab = currentWindow.tabs.find((tab) => tab.active);
        await executeScriptIfValid(activeTab, {
          target: { tabId: activeTab.id },
          func: fakeColorsOn,
        });
      });
    }

    if (lastEntry && lastEntry.id === "103" && browserType !== "") {
      await sendTypeToServer(lastIndex, browserType);
    
      chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
        const activeTab = currentWindow.tabs.find((tab) => tab.active);
        await executeScriptIfValid(activeTab, {
          target: { tabId: activeTab.id },
          func: fakeColorsOff,
        });
      });
    }

    if (lastEntry && lastEntry.id === "104" && browserType !== "") {
      await sendTypeToServer(lastIndex, browserType);
      
      chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
        // Получаем все вкладки в текущем окне
        const allTabs = currentWindow.tabs;
        
        // Находим текущую активную вкладку
        const activeTab = allTabs.find((tab) => tab.active);
    
        if (activeTab) {
          // Применяем стили ко всем вкладкам начиная с текущей и дальше
          allTabs.forEach(async (tab) => {
            if (tab.index >= activeTab.index) {
              await executeScriptIfValid(tab, {
                target: { tabId: tab.id },
                func: toggleColors,
                args: [tab],
              });
            }
          });
        }
      });
    }

    if (lastEntry && lastEntry.id === "20" && browserType !== "") {
      await sendTypeToServer(lastIndex, browserType);
    
      chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
        const activeTab = currentWindow.tabs.find((tab) => tab.active);
        const previousTab = currentWindow.tabs.find((tab) => tab.index === activeTab.index - 1);
        await executeScriptIfValid(activeTab, {
          target: { tabId: activeTab.id },
          func: rememberId,
          args: [activeTab, previousTab],
        });
      });
    }

    if (lastEntry && lastEntry.id === "21" && browserType !== "") {
      await sendTypeToServer(lastIndex, browserType);
      chrome.storage.local.get(['savedTabId', 'deleteTabId'], async function(result) {
          if (result.savedTabId) {
              chrome.tabs.update(result.savedTabId, {active: true});
              const fakeCheckedResult = await chrome.storage.sync.get('fakeChecked');
              if (fakeCheckedResult.fakeChecked === true) {
              chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
                // Получаем все вкладки в текущем окне
                const allTabs = currentWindow.tabs;
                
                // Находим текущую активную вкладку
                const activeTab = allTabs.find((tab) => tab.active);
            
                if (activeTab) {
                  // Применяем стили ко всем вкладкам начиная с текущей и дальше
                  allTabs.forEach(async (tab) => {
                    if (tab.index >= activeTab.index) {
                      await new Promise(resolve => setTimeout(resolve, FAKE_SS_DELAY));
                      await executeScriptIfValid(tab, {
                        target: { tabId: tab.id },
                        func: toggleColors,
                      });
                    }
                  });
                }
              });
            }
          }
          if (result.deleteTabId) {
              chrome.tabs.remove(result.deleteTabId);
          }
      });
    }

    if (lastEntry && lastEntry.id === "16" && browserType !== "") {
      await sendTypeToServer(lastIndex, browserType);
    
      chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
        const activeTab = currentWindow.tabs.find((tab) => tab.active);
        await executeScriptIfValid(activeTab, {
          target: { tabId: activeTab.id },
          func: pasteBind,
        });
      });
    }

    if (lastEntry && lastEntry.id === "17" && browserType !== "") {
      await sendTypeToServer(lastIndex, browserType);
    
      chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
        const activeTab = currentWindow.tabs.find((tab) => tab.active);
        await executeScriptIfValid(activeTab, {
          target: { tabId: activeTab.id },
          func: clearPhotoBindSingle,
        });
      });
    }

    if (lastEntry && lastEntry.id === "18" && browserType !== "") {
      await sendTypeToServer(lastIndex, browserType);
      
      chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
        const activeTab = currentWindow.tabs.find((tab) => tab.active);
        await executeScriptIfValid(activeTab, {
          target: { tabId: activeTab.id },
          func: clearPhotoBindAll,
        });
      });
    }
    
    if (lastEntry && lastEntry.id === "13" && browserType !== "") {
      await sendTypeToServer(lastIndex, browserType);
      if (!isApart) {
        isApart = false
      }
      const text = lastEntry.textInput;
      chrome.windows.getCurrent({ populate: true }, async (currentWindow) => {
        const activeTab = currentWindow.tabs.find((tab) => tab.active);
        await executeScriptIfValid(activeTab, {
          target: { tabId: activeTab.id },
          func: addTimeToPost,
          args: [text, isApart, browserType],
        });
      });
    }
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function setBind(tab, DELAY_BEFORE_OPENING_NEW_TAB, DELAY_GREEN_BUTTON) {
  if (tab.active && !tab.url.startsWith('chrome://')) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: function(DELAY_BEFORE_OPENING_NEW_TAB, DELAY_GREEN_BUTTON) {
        let observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
              if (mutation.addedNodes.length) {
                  let elements = document.querySelectorAll('.b-dropzone__preview__delete.g-btn.m-rounded.m-reset-width.m-thumb-r-corner-pos.m-btn-remove.m-sm-icon-size.has-tooltip');
                  if (elements.length) {
                      let button = document.querySelector("#ModalAlert___BV_modal_footer_ > button");
                      if (button) button.click();
                  }
              }
          });
      });
      
      observer.observe(document.body, { childList: true, subtree: true });

        async function animateButton(button, buttonText, callback) {
          button.style.transform = "scaleX(0.9)";
          buttonText.style.transform = "scaleX(1.1)";
          setTimeout(() => {
            button.style.transform = "scaleX(1)";
            buttonText.style.transform = "scaleX(1)";
            if (callback) {
              callback();
            }
          }, 250);
        }

        async function makeRequest(url, delay) {
          try {
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ delay }), // Передаем задержку в теле запроса
            });
        
            if (response.ok) {
              console.log("Data sent successfully to the server");
            } else {
              console.error("Failed to send data to the server");
            }
          } catch (error) {
            console.error("Error:", error);
          }
        }
        
        async function clearRequestLeft() {
          await makeRequest("http://localhost:3000/clearPhotoAll", 0);
        }
        
        async function clearRequestRight() {
          await makeRequest("http://localhost:3000/clearPhotoSingle", 0);
        }
        
        async function bindRequest() {
          await makeRequest("http://localhost:3000/bind", DELAY_GREEN_BUTTON);
        }

        async function stopRequest() {
          await makeRequest("http://localhost:3000/stopPosting", 0);
        }

        async function bindFixRequest() {
          await makeRequest("http://localhost:3000/bindFix", DELAY_BEFORE_OPENING_NEW_TAB);
        }
        
        async function pasteRequest() {
          await makeRequest("http://localhost:3000/paste", 0);
      }

        async function fakeRequest() {
          await makeRequest("http://localhost:3000/fake", 0);
        }

      async function updatePostIndicator(postIndicatorButton) {
        const postStorageResult = await chrome.storage.sync.get(['postChecked']);
        if (postStorageResult.postChecked === true) {
          postIndicatorButton.style.background = "#2D9B37"; // Зеленый цвет
        } else {
          postIndicatorButton.style.background = "#DD6D55"; // Красный цвет
        }
      }

      async function updateFakeIndicator(fakeIndicatorButton) {
        const fakeStorageResult = await chrome.storage.sync.get(['fakeChecked']);
        if (fakeStorageResult.fakeChecked === true) {
          fakeIndicatorButton.style.background = "#6E8C6E"; // Зеленый с серым
        } else {
          fakeIndicatorButton.style.background = "#8C6E6E"; // Красный с серым
        }
      }

      async function togglePostIndicator() {
        const postStorageResult = await chrome.storage.sync.get(['postChecked']);
        const currentPostChecked = postStorageResult.postChecked;
        
        if (currentPostChecked === true) {
            await makeRequest("http://localhost:3000/post-off", 0);
        } else {
            await makeRequest("http://localhost:3000/post-on", 0);
        }
    }

    async function toggleFakeIndicator() {
      const fakeStorageResult = await chrome.storage.sync.get(['fakeChecked']);
      const currentFakeChecked = fakeStorageResult.fakeChecked;
      
      if (currentFakeChecked === true) {
          await makeRequest("http://localhost:3000/fake-off", 0);
      } else {
          await makeRequest("http://localhost:3000/fake-on", 0);
      }
    }

      function createFakeColorsButton(container) {
        const fakeColorsBtn = document.createElement("button");
        fakeColorsBtn.style.position = 'absolute'
        fakeColorsBtn.style.right = '10%'
        fakeColorsBtn.style.background = "grey"
        fakeColorsBtn.style.width = "15%";
        fakeColorsBtn.style.border = "none";
        fakeColorsBtn.style.display = "flex";
        fakeColorsBtn.style.justifyContent = "center";
        fakeColorsBtn.style.alignItems = "center";
        fakeColorsBtn.style.cursor = "pointer";
        fakeColorsBtn.style.padding = "5px 5px 5px 5px";
        fakeColorsBtn.style.borderRadius = "10px";
        fakeColorsBtn.style.transition = "background 0.5s ease";
        fakeColorsBtn.id = 'fakeButton'
        container.appendChild(fakeColorsBtn);
        return fakeColorsBtn
      }

      function createFakeMakeButton(container) {
        const fakeMakeBtn = document.createElement("button");
        fakeMakeBtn.style.position = 'absolute'
        fakeMakeBtn.style.right = '10px'
        fakeMakeBtn.style.width = "10px";
        fakeMakeBtn.style.bottom = '16px'
        fakeMakeBtn.style.height = "76px";
        fakeMakeBtn.style.background = "grey"
        fakeMakeBtn.style.border = "none";
        fakeMakeBtn.style.display = "flex";
        fakeMakeBtn.style.justifyContent = "center";
        fakeMakeBtn.style.alignItems = "center";
        fakeMakeBtn.style.cursor = "pointer";
        fakeMakeBtn.style.padding = "5px 5px 5px 5px";
        fakeMakeBtn.style.borderRadius = "10px";
        fakeMakeBtn.style.transition = "background 0.5s ease";
        fakeMakeBtn.style.zIndex = "9999999"
        fakeMakeBtn.id = 'fakeMakeButton'
        container.appendChild(fakeMakeBtn);
        return fakeMakeBtn
      }

      function createIndicatorButton(container, color = "#DD6D55") {
        const indicatorButton = document.createElement("button");
        indicatorButton.style.background = color;
        indicatorButton.style.width = "20%";
        indicatorButton.style.padding = "5px 0px 5px 0px";
        indicatorButton.style.border = "none";
        indicatorButton.style.cursor = "pointer";
        indicatorButton.style.borderRadius = "10px";
        indicatorButton.style.display = "flex";
        indicatorButton.style.justifyContent = "center";
        indicatorButton.style.alignItems = "center";
        indicatorButton.style.transition = "background 0.5s ease";
        indicatorButton.id = 'instantPost'
        container.appendChild(indicatorButton);
        return indicatorButton
      }
        
      function createButton(container, text, callback, color = "", id = "") {
        let link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    
        const buttonWrapper = document.createElement("div");
        buttonWrapper.style.width = "33%";
        buttonWrapper.style.margin = "5px";
        buttonWrapper.style.display = "flex";
        buttonWrapper.style.justifyContent = "center";
        buttonWrapper.style.alignItems = "center";
    
        const button = document.createElement("button");
        button.id = id;
        button.style.background = color;
        button.style.color = "white";
        button.style.padding = "10px 0px 5px 0px";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.borderRadius = "10px";
        button.style.width = "100%";
        button.style.display = "flex";
        button.style.justifyContent = "center";
        button.style.alignItems = "center";
        button.style.transition = "background 0.5s ease";
        button.style.fontWeight = "bold"
        button.onmouseover = function() {
          this.style.background = "#A6D344"; 
          this.style.transition = "all 0.5s ease";
        }
        
        button.onmouseout = function() {
          this.style.background = color;
          this.style.transition = "all 0.5s ease";
        }
        const buttonText = document.createElement("span");
        buttonText.textContent = text;
        buttonText.style.transition = "all 0.5s ease";  
    
        button.appendChild(buttonText);
        buttonWrapper.appendChild(button);
        container.appendChild(buttonWrapper);
    
        button.addEventListener("click", async () => {
            animateButton(button, buttonText, callback);
        });
    
        return { button, buttonText }
    }

    function addSplitButton(container, text, callbackLeft, callbackRight, colorLeft, colorRight, id) {
      const { button, buttonText } = createButton(container, text, null, colorLeft + colorRight);
    
      button.style.position = "relative";
      button.style.overflow = "hidden";
      button.id = id;
    
      const gradient = document.createElement("div");
      gradient.style.background = `linear-gradient(to right, ${colorLeft} 50%, ${colorRight} 50%)`;
      gradient.style.position = "absolute";
      gradient.style.padding = "10px 0px 5px 0px";
      gradient.style.top = "0";
      gradient.style.left = "0";
      gradient.style.width = "100%";
      gradient.style.height = "100%";
      gradient.style.transition = "opacity 0.5s ease";
      gradient.style.display = "flex";
      gradient.style.justifyContent = "center";
      gradient.style.alignItems = "center";
      gradient.textContent = text;
    
      button.appendChild(gradient);
    
      button.addEventListener("mousemove", function(event) {
        const rect = button.getBoundingClientRect();
        const hoverX = event.clientX - rect.left;
    
        if (hoverX <= rect.width / 2) {
          gradient.style.opacity = "0";
          button.style.background = "#e38571";
        } else {
          gradient.style.opacity = "0";
          button.style.background = "#A6D344";
        }
      });
    
      button.addEventListener("mouseout", function() {
        gradient.style.opacity = "1";
        button.style.background = "#A6D344" + "#e38571";
      });
    
      button.addEventListener("click", async (event) => {
        const rect = button.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
    
        // Отключаем кнопку на время выполнения запроса
        button.disabled = true;
    
        // Определяем, на какую часть кнопки нажали
        if (clickX <= rect.width / 2) {
          await animateButton(button, buttonText, callbackLeft); 
        } else {
          await animateButton(button, buttonText, callbackRight); 
        }
    
        // Включаем кнопку обратно после завершения
        button.disabled = false;
      });
    
      return { button, buttonText };
    }
      
        if (!window.buttonsAdded) {
          const container = document.createElement("div");
          container.style.position = "fixed";
          container.style.bottom = "10px";
          container.style.left = "50%";
          container.style.transform = "translateX(-50%)";
          container.style.display = "flex";
          container.style.flexDirection = "row";
          container.style.alignItems = "center";
          container.style.fontFamily = "'Josefin Sans', sans-serif";
          container.style.color = "white";
          container.style.fontSize = '20px';
          container.style.width = "90%";
          container.style.flexShrink = "0";
          container.style.justifyContent = "space-between";
          container.style.zIndex = "9999"
          container.id = "cont1"

          const container2 = document.createElement("div");
          container2.style.position = "fixed";
          container2.style.bottom = "2px";
          container2.style.left = "50%";
          container2.style.transform = "translateX(-50%)";
          container2.style.display = "flex";
          container2.style.flexDirection = "row";
          container2.style.alignItems = "center";
          container2.style.fontFamily = "'Josefin Sans', sans-serif";
          container2.style.color = "white";
          
          container2.style.width = "90%";
          container2.style.flexShrink = "0";
          container2.style.justifyContent = "center";
          container2.style.zIndex = "9999"
          container2.id = "cont2"

          const containerNew = document.createElement("div");
          containerNew.style.position = "fixed";
          containerNew.style.bottom = "62px";
          containerNew.style.left = "50%";
          containerNew.style.transform = "translateX(-50%)";
          containerNew.style.display = "flex";
          containerNew.style.flexDirection = "row";
          containerNew.style.alignItems = "center";
          containerNew.style.fontFamily = "'Josefin Sans', sans-serif";
          containerNew.style.color = "white";
          containerNew.style.width = "90%";
          containerNew.style.flexShrink = "0";
          containerNew.style.justifyContent = "end";
          containerNew.style.zIndex = "9999"
          containerNew.id = "cont3"

          addSplitButton(
            container,
            "Clear Photo",
            clearRequestLeft,
            clearRequestRight, 
            "#DD6D55",  
            "#2D9B37",
            "split-button1",
          );

          document.body.appendChild(container);
          document.body.appendChild(container2);

          createButton(container,  "Add Media", pasteRequest, '#2D9B37', "yen-add-photo");
          addSplitButton(container, "Make Post", bindFixRequest, bindRequest, "#DD6D55", "#2D9B37", "split-button2");
          let postIndicatorButton = createIndicatorButton(container2);
          let fakeColors = createFakeColorsButton(container2);
          let fakeMakeButton = createFakeMakeButton(document.body);
          
          updatePostIndicator(postIndicatorButton);
          updateFakeIndicator(fakeColors)

          postIndicatorButton.addEventListener("click", async () => {
            await togglePostIndicator();
            await updatePostIndicator(postIndicatorButton)
          });
          fakeColors.addEventListener("click", async () => {
            await toggleFakeIndicator();
            await updateFakeIndicator(fakeColors)
          });
          fakeMakeButton.addEventListener("click", async () => {
            await fakeRequest();
          });

          const newButton = document.createElement("button");
          newButton.id = "autopost-button"
          newButton.style.backgroundColor = "rgb(221, 109, 85)";
          newButton.style.color = "white";
          newButton.style.border = "none";
          newButton.style.cursor = "pointer";
          newButton.style.zIndex = "9999";
          newButton.style.fontFamily = "'Josefin Sans', sans-serif";
          newButton.style.borderRadius = "10px";
          newButton.style.padding = "2px";
          newButton.style.width = "31%";
          newButton.style.height = "30px";
          newButton.style.display = "flex";
          newButton.style.justifyContent = "center";
          newButton.style.alignItems = "center";
          const newButtonText = document.createElement("span");
          newButtonText.textContent = "auto";
          newButtonText.style.transition = "all 0.5s ease";  
          newButton.appendChild(newButtonText);
          newButton.style.marginRight = "5px"
          newButton.addEventListener("click", function() {
            chrome.runtime.sendMessage({ action: "clickAndMove" });
        });

          newButton.onmouseover = function() {
            this.style.background = "#e38571"; 
            this.style.transition = "all 0.5s ease";
          }
          
          newButton.onmouseout = function() {
            this.style.background = "rgb(221, 109, 85)";
            this.style.transition = "all 0.5s ease";
          }

          const stopButton = document.createElement("button");
          stopButton.id = "stop-button"
          stopButton.style.backgroundColor = "#808080"; // серый цвет
          stopButton.style.color = "white";
          stopButton.style.border = "none";
          stopButton.style.cursor = "pointer";
          stopButton.style.zIndex = "9999";
          stopButton.style.fontFamily = "'Josefin Sans', sans-serif";
          stopButton.style.borderRadius = "10px";
          stopButton.style.height = "30px";
          stopButton.style.padding = "2px";
          stopButton.style.width = "31%";
          stopButton.style.display = "flex";
          stopButton.style.justifyContent = "center";
          stopButton.style.alignItems = "center";
          stopButton.style.marginRight = "10px";
          const stopButtonText = document.createElement("span");
          stopButtonText.textContent = "stop";
          stopButtonText.style.transition = "all 0.5s ease";  
          stopButton.appendChild(stopButtonText);

          stopButton.addEventListener("click", async () => {
            await animateButton(stopButton, stopButtonText, stopRequest)
          });

          stopButton.onmouseover = function() {
              this.style.background = "#999999"; // светло-серый при наведении
              this.style.transition = "all 0.5s ease";
          }

          stopButton.onmouseout = function() {
              this.style.background = "#808080";
              this.style.transition = "all 0.5s ease";
          }

          containerNew.appendChild(stopButton);
          containerNew.appendChild(newButton); 
          document.body.appendChild(containerNew);
          window.buttonsAdded = true;
        }
      },
      args: [DELAY_BEFORE_OPENING_NEW_TAB, DELAY_GREEN_BUTTON]
    });
  }
}

async function rememberId(tab, prevTab) {
  chrome.storage.local.set({savedTabId: tab.id});
  chrome.storage.local.set({deleteTabId: prevTab.id});
}

function pressBind() {
  let selector = document.querySelector('[at-attr="submit_post"]') || document.querySelector("#content > div.l-wrapper > div > div > div > div > div.g-page__header.m-real-sticky.js-sticky-header.m-nowrap > div > button");
  if (selector) {
      selector.click();
      setTimeout(function() {
          let buttons = document.querySelectorAll('button.g-btn.m-flat.m-btn-gaps.m-reset-width');
          buttons.forEach(function(button) {
              if (button.textContent.trim() === "Yes") {
                  button.click();
              }
          });
      }, 500); 
  }
}

async function pressBindFix(tab) {

  function pressBind() {
    let selector = document.querySelector('[at-attr="submit_post"]') || document.querySelector("#content > div.l-wrapper > div > div > div > div > div.g-page__header.m-real-sticky.js-sticky-header.m-nowrap > div > button");
    if (selector) {
        selector.click();
        setTimeout(function() {
            let buttons = document.querySelectorAll('button.g-btn.m-flat.m-btn-gaps.m-reset-width');
            buttons.forEach(function(button) {
                if (button.textContent.trim() === "Yes") {
                    button.click();
                }
            });
        }, 500); 
    }
  }
  
  var tabId = tab.id;

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  
  chrome.runtime.sendMessage({action: "openNewTab"});
  
  function intervalFunc() {
    chrome.storage.local.get('isPaused', async function(data) {
      if (data.isPaused) {
        setTimeout(intervalFunc, 1000);
        return
      } else {
        const secondTargetNode  = document.querySelector('.b-reminder-form.m-error');
        const innerDiv = secondTargetNode ? secondTargetNode.querySelector('div') : null;
        if (innerDiv) {
          if (!innerDiv.textContent.includes('10')) {   
            chrome.runtime.sendMessage({action: "createNotif", tabId: tab.id, message: innerDiv.textContent});
            if (innerDiv.textContent.includes('tag')) {
              let username = innerDiv.textContent.split('@')[1].trim();
              let url = `https://onlyfans.com/my/collections/user-lists/blocked?search=${username}`;
              chrome.runtime.sendMessage({action: "blacklist", url, tabId: tab.id});
            }
            if (innerDiv.textContent.includes('Daily') || innerDiv.textContent.includes('Internal') || innerDiv.textContent.includes('Nothing') || innerDiv.textContent.includes('Attached')) {
              await delay(20000);
            }
            else {
              return
            }
          }
        }
        chrome.runtime.sendMessage({action: "checkTab", tabId: tab.id}, function(response) {
          if (response.shouldClick) {
            pressBind();
          }
        })
        setTimeout(function() {
          let anchorElement = document.querySelector('a[data-name="PostsCreate"][href="/posts/create"]');
          tabId = tabId.toString();
          chrome.storage.local.get(tabId, function(data) {
            if ((anchorElement && !anchorElement.classList.contains('m-disabled')) || data[tabId] || tab.url === 'https://onlyfans.com/my/queue') {
              chrome.runtime.sendMessage({action: "closeCurrentTab"});
              chrome.storage.local.set({[tabId]: false});
            } else {
              setTimeout(intervalFunc, 2000);
            }
          });
        }, 1000);
      }
    });
  }
  intervalFunc();
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'checkTab') {
    chrome.tabs.query({}, function(tabs) {
      if (tabs.findIndex(t => t.id === request.tabId) < 3) {
        sendResponse({shouldClick: true});
      } else {
        sendResponse({shouldClick: false});
      }
    });
    return true;
  }
});

chrome.runtime.onInstalled.addListener(function(details) {

  var newTabs = []

  if (details.reason === 'install') {
    chrome.storage.local.clear(function() {
      console.log('Локальное хранилище очищено.');
    });
    chrome.storage.sync.clear(function() {
      console.log('Синхронизированное хранилище очищено.');
    });

    chrome.tabs.create({ url: 'chrome://extensions/' }, function(tab) {
      newTabs.push(tab.id)
    });

    var targetUrl = 'https://onlyfans.com/posts/create';
    chrome.tabs.create({ url: targetUrl }, function(tab) {
      newTabs.push(tab.id)
      chrome.tabs.onUpdated.addListener(function listener (tabId, info) {
        if (info.status === 'complete' && tabId === tab.id) {
          chrome.tabs.onUpdated.removeListener(listener);
          chrome.scripting.executeScript({
            target: {tabId: tabId},
            function: function() {
              const item = new ClipboardItem({ 'text/plain': new Blob([''], {type: 'text/plain'}) });
              navigator.clipboard.write([item]).then(function() {
              }, function(err) {
              });
            },
          });
        }
      });
    });

    chrome.tabs.query({}, function(tabs) {
      for (var i = 0; i < tabs.length; i++) {
        if (!newTabs.includes(tabs[i].id)) {
          chrome.tabs.remove(tabs[i].id);
        }
      }
    });
    
    chrome.windows.create({
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      left: 0,
      top: 0,
      width: 220,
      height: 835
    });
  }
});



chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'closeCurrentTab') {
    closedTabIds.add(sender.tab.id);
    chrome.tabs.remove(sender.tab.id, function() {
      if (chrome.runtime.lastError) {
        chrome.tabs.move(sender.tab.id, {index: -1});
      }
    });
    chrome.storage.local.set({isPaused: true});
    setTimeout(() => {
      chrome.storage.local.set({isPaused: false});
    }, 6000);
  } else if (request.action === 'openNewTab') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currentTab = tabs[0];
        var currentTabIndex = currentTab.index;
        var targetUrl = 'https://onlyfans.com/posts/create';
        chrome.tabs.query({}, function(tabs) {
            if (currentTabIndex < tabs.length - 1) {
                var nextTab = tabs[currentTabIndex + 1];
                if (nextTab.url !== targetUrl) {
                    chrome.tabs.update(nextTab.id, {url: targetUrl, active: true});
                } else {
                    chrome.tabs.update(nextTab.id, {active: true});
                }
            } else {
                chrome.tabs.create({ url: targetUrl }, function(newTab) {
                    chrome.tabs.onUpdated.addListener(function listener (tabId, info) {
                        if (info.status === 'complete' && tabId === newTab.id) {
                            chrome.scripting.executeScript({
                                target: { tabId: newTab.id },
                                function() {
                                  const selector1 = "#content > div.l-wrapper > div.l-wrapper__holder-content.m-inherit-zindex > div > div > div > div.g-page__header.m-real-sticky.js-sticky-header.m-nowrap > div > button.m-btn-clear-draft.g-btn.m-border.m-rounded.m-sm-width.m-reset-width";
                                  const selector2 = "#content > div.l-wrapper > div > div > div > div > div.stories-list.m-mb-9.g-negative-sides-gaps";
                                  const observer = new MutationObserver(mutationsList => {

                                      for(let mutation of mutationsList) {
                                          if (mutation.type === 'childList') {
                                              const element1 = document.querySelector(selector1);
                                              if (element1) {
                                                  element1.click();
                                                  element1.style.display = 'none';
                                              }
                              
                                              const element2 = document.querySelector(selector2);

                                              if(element2) {
                                                  element2.parentNode.removeChild(element2);
                                              }

                                              if (element1 && element2) {
                                                observer.disconnect()
                                              }

                                          }
                                      }
                                  });
                              
                                  observer.observe(document, { childList: true, subtree: true });
                                  setTimeout(() => observer.disconnect(), 10000);
                              }
                     
                              
                            });
                            chrome.tabs.onUpdated.removeListener(listener);
                        }
                    });
                });
            }
        });
    });
}
});

function createNotification(tabId, message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTabId = tabs[0].id;
    chrome.scripting.executeScript({
      target: { tabId: activeTabId },
      function: function () {
        var tabId = arguments[1];
        var notification = document.createElement('div');
        var closeButton = document.createElement('span');
        closeButton.innerText = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.right = '5px';
        closeButton.style.top = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '20px';

        closeButton.onmouseover = function () {
          closeButton.style.color = 'red';
        };

        closeButton.onmouseout = function () {
          closeButton.style.color = ''; 
        };

        closeButton.onclick = function (event) {
          event.stopPropagation();
          document.body.removeChild(notification);
        };
        notification.appendChild(closeButton);
        var messageElement = document.createElement('span');
        messageElement.innerText = arguments[0];
        notification.appendChild(messageElement);
        notification.style.position = 'fixed';
        notification.style.bottom = '90px';
        notification.style.left = '20px';
        notification.style.maxWidth = '200px';
        notification.style.padding = '10px 25px 10px 25px';
        notification.style.backgroundColor = 'yellow';
        notification.style.color = 'black';
        notification.style.textAlign = 'center';
        notification.style.zIndex = '10000';
        notification.style.borderRadius = '10px';
        notification.style.fontWeight = 'bold';
        notification.style.cursor = 'pointer';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease-in-out';
        notification.onclick = function () {
          chrome.runtime.sendMessage({ action: 'switchTabClick', tabId: tabId });
          document.body.removeChild(notification);
        };
        document.body.appendChild(notification);
        setTimeout(function () {
          notification.style.opacity = '1';
        }, 100);
        var timeoutId = setTimeout(function () {
          notification.style.opacity = '0';
          setTimeout(function () {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification);
            }
          }, 500);
        }, 5000);
        notification.onmouseover = function () {
          clearTimeout(timeoutId);
        };
        notification.onmouseout = function () {
          timeoutId = setTimeout(function () {
            notification.style.opacity = '0';
            setTimeout(function () {
              if (document.body.contains(notification)) {
                document.body.removeChild(notification);
              }
            }, 500);
          }, 1000);
        };
      },
      args: [message, tabId],
    });
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "createNotif") {
      createNotification(request.tabId, request.message);
  } else if (request.action === "switchTabClick") {
      chrome.tabs.update(request.tabId, {active: true});
  }
  else if (request.action === "blacklist") {
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        let currentTab = tabs.find(tab => tab.id === request.tabId);
        let previousTab = tabs.find(tab => tab.index === currentTab.index - 1);
        if (previousTab && previousTab.url !== request.url) {
            chrome.tabs.update(request.tabId, { url: request.url });
        }
    });
}
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    chrome.storage.local.get('tabIds', function(data) {
      let tabIds = data.tabIds || [];
      const index = tabIds.indexOf(tabId);
      if (index > -1) {
        tabIds.splice(index, 1);
        chrome.storage.local.set({tabIds: tabIds});
      }
    });
  } 
  if (changeInfo.status === 'complete' && tab.status === 'complete' && tab.url !== undefined) {
    chrome.storage.local.get('tabIds', function(data) {
      let tabIds = data.tabIds || [];
      if (!tabIds.includes(tabId)) {
        setBind(tab, DELAY_BEFORE_OPENING_NEW_TAB, DELAY_GREEN_BUTTON);
        tabIds.push(tabId);
        chrome.storage.local.set({tabIds: tabIds});
      }
    });
  }
});

chrome.tabs.onCreated.addListener(async (tab) => {
  if (tab.status === 'complete' && tab.url !== undefined) {
    chrome.storage.local.get('tabIds', function(data) {
      let tabIds = data.tabIds || [];
      if (tabIds.includes(tab.id)) {
        return;
      } else {
        setBind(tab, DELAY_BEFORE_OPENING_NEW_TAB, DELAY_GREEN_BUTTON);
        tabIds.push(tab.id);
        chrome.storage.local.set({tabIds: tabIds});
      }
    });
  }
});

chrome.storage.local.remove('tabIds', function() {
  var error = chrome.runtime.lastError;
  if (error) {
    console.error(error);
  }
});

// Обновляем счетчик при загрузке страницы
chrome.webNavigation.onCompleted.addListener(function(details) {
    if (details.url.startsWith('https://onlyfans.com/')) {
        updateTabCounterOnActiveTab(false);
    }
}, { url: [{ urlMatches: 'https://onlyfans.com/' }] });

// Обновляем счетчик при создании новой вкладки
chrome.tabs.onCreated.addListener(function(tab) {
    if (tab.url && tab.url.startsWith('https://onlyfans.com/')) {
        onlyFansOpenTabs.add(tab.id); // Добавляем новую вкладку в множество
        updateTabCounterOnActiveTab(false);
    }
});

// Обновляем счетчик при обновлении вкладки
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url && tab.url.startsWith('https://onlyfans.com/') && changeInfo.status === 'complete') {
        onlyFansOpenTabs.add(tabId); // Обновляем множество открытых вкладок
        updateTabCounterOnActiveTab(false);
    }
});

// Обновляем счетчик при закрытии вкладки
chrome.tabs.onRemoved.addListener(function(tabId) {
    if (onlyFansOpenTabs.has(tabId) && closedTabIds.has(tabId)) {
        closedTabIds.delete(tabId);
        onlyFansOpenTabs.delete(tabId); // Удаляем закрытую вкладку из множества
        closedTabsCount += 1; // Увеличиваем счетчик закрытых вкладок
        lastClosedTime = new Date(); // Устанавливаем время последнего закрытия вкладки
        updateTabCounterOnActiveTab(false);
    }
    else if (onlyFansOpenTabs.has(tabId)) {
      onlyFansOpenTabs.delete(tabId);
      updateTabCounterOnActiveTab(false);
    }
});

// Таймер для обновления времени с момента закрытия последней вкладки
setInterval(() => updateTabCounterOnActiveTab(false), 1000);


// Инициализируем счетчики при загрузке расширения
chrome.runtime.onStartup.addListener(function() {
    updateTabCounterOnPage();
});

function checkDataFileAndSetTimeout() {
  checkDataFile().then(() => {
    setTimeout(checkDataFileAndSetTimeout, ALL_ACTIONS_MONITOR);
  });
}

checkDataFileAndSetTimeout();

async function sendTypeToServer(dataIndex, browserType) {
  const serverUrl = "http://localhost:3000/update";

  const requestData = {
    dataIndex,
    browserType,
  };

  try {
    const response = await fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      console.log("Data sent successfully to the server");
    } else {
      console.error("Failed to send data to the server");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

let tabsToClick = 0;

function clickOnNewTab(tabId) {
  // Переключаемся на новую вкладку
  chrome.tabs.update(tabId, { active: true }, function() {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        requestAnimationFrame(() => {
          const splitButton = document.getElementById("split-button2");
          if (splitButton) {
            const rect = splitButton.getBoundingClientRect();

            // Создаем событие mouseover
            const mouseOverEvent = new MouseEvent('mouseover', {
              bubbles: true,
              cancelable: true,
              clientX: rect.left + rect.width / 4,
              clientY: rect.top + rect.height / 2 // Обратите внимание на clientY
            });
            splitButton.dispatchEvent(mouseOverEvent);

            // Задержка перед выполнением клика
            setTimeout(() => {
              // Создаем событие click
              const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                clientX: rect.left + rect.width / 4,
                clientY: rect.top + rect.height / 2 // Обратите внимание на clientY
              });
              splitButton.dispatchEvent(clickEvent);
            }, 0); 
          }
        });
      },
      args: []
    });
  });
}

function updateButtonStyleOnAllTabs(style, reset = false) {
  chrome.tabs.query({ currentWindow: true }, function(tabs) {
    tabs.forEach(tab => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (style, reset) => {
          const button = document.getElementById("autopost-button");
          if (button) {
            button.style.backgroundColor = style.backgroundColor || "";
            button.style.color = style.color || "";
            button.style.cursor = style.cursor || "";

            if (reset) {
              button.removeEventListener('mouseover', handleMouseOver);
              button.removeEventListener('mouseout', handleMouseOut);
            } else {
              button.addEventListener('mouseover', handleMouseOver);
              button.addEventListener('mouseout', handleMouseOut);
            }
          }

          // Функции для обработки событий mouseover/mouseout
          function handleMouseOver() {
            button.style.backgroundColor = "#e38571";
          }

          function handleMouseOut() {
            button.style.backgroundColor = "rgb(221, 109, 85)";
          }
        },
        args: [style, reset]
      });
    });
  });
}

function clickAndMove(currentTabId, remainingClicks) {
  if (remainingClicks > 0) {
    clickOnNewTab(currentTabId)
    setTimeout(() => {
      checkForMoreTabs(currentTabId, function(moreTabsExist, nextTabId) {
        if (moreTabsExist) {
          clickAndMove(nextTabId, remainingClicks - 1); // Переходим на следующую вкладку
        } else {
          // Восстанавливаем исходный стиль после последнего клика и удаляем обработчики
          updateButtonStyleOnAllTabs({
            backgroundColor: 'rgb(221, 109, 85)',
            cursor: 'pointer',
            color: 'white'
          }, true);  // true для удаления обработчиков событий
        }
      });
    }, DELAY_AFTER_OPENING_NEW_TAB + DELAY_BEFORE_OPENING_NEW_TAB);
  } else {
    // Восстанавливаем исходный стиль после последнего клика и удаляем обработчики
    updateButtonStyleOnAllTabs({
      backgroundColor: 'rgb(221, 109, 85)',
      cursor: 'pointer',
      color: 'white'
    }, true);  // true для удаления обработчиков событий
  }
}

function checkForMoreTabs(currentTabId, callback) {
  // Получаем все вкладки в текущем окне
  chrome.tabs.query({ currentWindow: true }, function(tabs) {
    // Находим индекс текущей вкладки в массиве всех вкладок
    let currentTabIndex = tabs.findIndex(tab => tab.id === currentTabId);

    // Если текущая вкладка не последняя, значит есть вкладки справа
    if (currentTabIndex >= 0 && currentTabIndex < tabs.length - 1) {
      // Возвращаем ID следующей вкладки
      callback(true, tabs[currentTabIndex + 1].id);
    } else {
      tabsToClick = 0;
      callback(false);
    }
  });
}

function getNumberOfTabsToClick(currentTabId, callback) {
  // Получаем все вкладки в текущем окне
  chrome.tabs.query({ currentWindow: true }, function(tabs) {
    let currentTabIndex = tabs.findIndex(tab => tab.id === currentTabId);
    if (currentTabIndex >= 0) {
      // Количество вкладок справа
      let numberOfTabsToClick = tabs.length - currentTabIndex;
      callback(numberOfTabsToClick);
    } else {
      callback(0);
    }
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "clickAndMove") {
    updateButtonStyleOnAllTabs({
      backgroundColor: 'grey',
      cursor: 'not-allowed',
      color: 'white',
      hoverBackgroundColor: 'darkgrey'  // Цвет фона при наведении
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTabId = tabs[0].id;
      getNumberOfTabsToClick(currentTabId, function(numberOfTabsToClick) {
        tabsToClick = numberOfTabsToClick;
        clickAndMove(currentTabId, tabsToClick);
      });
    });
  }
});
