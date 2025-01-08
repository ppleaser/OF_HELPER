function copyToClipboard(text, event) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    var replacedText = text.replace(/<br>/g, "\n");
    dummy.value = replacedText;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    // Add animation
    var copyButton = event.target;
    copyButton.classList.add('animate');
    
    if (!copyButton.dataset.clickCount || copyButton.dataset.clickCount % 2 === 0) {
        copyButton.style.backgroundColor = '#D26BFF';
        copyButton.dataset.clickCount = 1;
    } else {
        copyButton.style.backgroundColor = '#fbdf56';
        copyButton.dataset.clickCount++;
    }
    // Remove animation
    setTimeout(function() {
        copyButton.classList.remove('animate');
    }, 200);
}

let rotationStates = {};

async function rotateMedia(mediaId, direction, filePath, mediaType) {
    const mediaElement = document.getElementById(mediaId);
    
    if (!mediaElement) return;

    // Initialize rotation state if not exists
    if (!rotationStates[mediaId]) {
        rotationStates[mediaId] = 0;
    }

    // Update rotation state
    rotationStates[mediaId] += (direction === 'right' ? 90 : -90);
    
    // Normalize rotation to 0-360 degrees
    rotationStates[mediaId] = ((rotationStates[mediaId] % 360) + 360) % 360;

    try {
        const response = await fetch('/rotate-media', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filePath: filePath,
                direction: direction,
                mediaType: mediaType
            })
        });

        if (!response.ok) {
            console.error('Failed to rotate media on server');
            return;
        }

        // Apply rotation transform only after the server confirms the action
        const mediaElement = document.getElementById(mediaId);
        if (!mediaElement) return;

        // Apply rotation transform
        mediaElement.style.transform = `rotate(${rotationStates[mediaId]}deg)`;

        // Adjust max-width and max-height based on rotation
        if (rotationStates[mediaId] % 180 === 0) {
            // Portrait mode (0 or 180 degrees)
            mediaElement.style.maxWidth = '310px';
            mediaElement.style.maxHeight = '';
        } else {
            // Landscape mode (90 or 270 degrees)
            mediaElement.style.maxWidth = '';
            mediaElement.style.maxHeight = '310px';
        }

    } catch (error) {
        console.error('Error rotating media:', error);
    }
}


function copyImageToClipboard(imgBase64, event) {
    var img = new Image();
    img.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(this, 0, 0);
        canvas.toBlob(function(blob) {
            var item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]);

            // Add animation
            var copyButton = event.target;
            copyButton.classList.add('animate');
            if (!copyButton.dataset.clickCount || copyButton.dataset.clickCount % 2 === 0) {
                copyButton.style.backgroundColor = '#6B8FFF';
                copyButton.dataset.clickCount = 1;
            } else {
                copyButton.style.backgroundColor = '#6BFF96';
                copyButton.dataset.clickCount++;
            }
            // Remove animation
            setTimeout(function() {
                copyButton.classList.remove('animate');
            }, 200);
        });
    };
    img.src = imgBase64;
}


async function copyVideoToClipboard(videoPath, event) {
    try {

        var copyButton = event.target;
        copyButton.classList.add('animate');
        if (!copyButton.dataset.clickCount || copyButton.dataset.clickCount % 2 === 0) {
            copyButton.style.backgroundColor = '#6B8FFF';
            copyButton.dataset.clickCount = 1;
        } else {
            copyButton.style.backgroundColor = '#6BFF96';
            copyButton.dataset.clickCount++;
        }

        // Remove animation after a short delay
        setTimeout(function () {
            copyButton.classList.remove('animate');
        }, 200);

        await fetch('http://localhost:3000/copy-video', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ path: videoPath }),
                });


    } catch (err) {
        console.error('Could not copy video: ', err);
    }
}

async function openFolder() {
    var copyButton = document.getElementById('open-folder-button');
    copyButton.classList.add('animate');
    setTimeout(function() {
        copyButton.classList.remove('animate');
    }, 200);

    fetch('/open-folder', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        var element = document.getElementById('delete-status');
        if (data.message) {
        element.textContent = data.message;
        element.classList.add('show');
        element.style.animation = 'slide-up 0.5s forwards';
        setTimeout(function() {
            element.classList.remove('show');
            element.style.animation = 'none';
        }, 5000);
    }
    });
}

async function copyFiles() {
    var copyButton = document.getElementById('copy-files-button');
    copyButton.classList.add('animate');
    setTimeout(function() {
        copyButton.classList.remove('animate');
    }, 200);

    fetch('/copy-files', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        var element = document.getElementById('delete-status');
        if (data.message) {
        element.textContent = data.message;
        element.classList.add('show');
        element.style.animation = 'slide-up 0.5s forwards';
        setTimeout(function() {
            element.classList.remove('show');
            element.style.animation = 'none';
        }, 5000);
    }
    });
}

function sendFiles(receiver_id, client_id, event) {

    var copyButton = event.target;
    copyButton.classList.add('animate');

    setTimeout(function() {
        copyButton.classList.remove('animate');
    }, 200);

    var data = {
        receiver_id: receiver_id,
        client_id: client_id,
    };
    fetch('/sendFiles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        var element = document.getElementById('send-status');
        element.textContent = data.message;
        element.classList.add('show');
        element.style.animation = 'slide-up 0.5s forwards';
        var copyButton = document.getElementById('send-button');
        copyButton.classList.add('animate');
        
        if (!copyButton.dataset.clickCount || copyButton.dataset.clickCount > 0) {
            copyButton.style.backgroundColor = '#D0FF6B ';
            copyButton.dataset.clickCount = 1;
        } 

        setTimeout(function() {
            copyButton.classList.remove('animate');
        }, 200);

        setTimeout(function() {
            element.classList.remove('show');
            element.style.animation = 'none';
        }, 5000);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function deleteFiles() {
    var copyButton = document.getElementsByClassName('button2')[0];
    copyButton.classList.add('animate');
    setTimeout(function() {
        copyButton.classList.remove('animate');
    }, 200);

    fetch('/delete-files', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        var element = document.getElementById('delete-status');
        if (data.message) {
        element.textContent = data.message;
        element.classList.add('show');
        element.style.animation = 'slide-up 0.5s forwards';
        setTimeout(function() {
            element.classList.remove('show');
            element.style.animation = 'none';
        }, 5000);
    }
    });
}

function switchAutoDelete(sw) {
    var copyButton = document.getElementsByClassName('button3')[0];
    copyButton.classList.add('animate');
    setTimeout(function() {
        copyButton.classList.remove('animate');
    }, 200);
    fetch('/switch-auto-delete', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        var element = document.getElementById('delete-status');
        if (data.message) {
        element.textContent = data.message;
        element.classList.add('show');
        element.style.animation = 'slide-up 0.5s forwards';
        setTimeout(function() {
            element.classList.remove('show');
            element.style.animation = 'none';
        }, 5000);
    }
    });
}

function deleteOneFile() {

    var copyButton = document.getElementsByClassName('button1')[0];;
    copyButton.classList.add('animate');
    setTimeout(function() {
        copyButton.classList.remove('animate');
    }, 200);

    fetch('/delete-files-one', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        var element = document.getElementById('delete-status');
        if (data.message) {
        element.textContent = data.message;
        element.classList.add('show');
        element.style.animation = 'slide-up 0.5s forwards';
        setTimeout(function() {
            element.classList.remove('show');
            element.style.animation = 'none';
        }, 5000);
    }
    });
}

function checkFiles(nickname) {
    fetch('/check-files')
    .then(response => response.json())
    .then(data => {
        document.getElementById('button-text').textContent = data.files
        document.getElementById('send-button').textContent = 'Send ' + data.files + ' files to ' + nickname;
    });
}

function updateHintCheckbox(chatId, hintKey, action = 'update', hintType = 'personal') {
    fetch('/update_hints', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            hint_key: hintKey,
            action: action,
            hint_type: hintType
        })
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('hints-container');
        if (!container || data.status === 'empty') {
            if (container) container.remove();
            return;
        }
         
        // Находим все чекбоксы
        const allCheckboxes = Array.from(container.querySelectorAll('input[type="checkbox"]'));
        const allHintItems = Array.from(container.querySelectorAll('.hint-item'));
        
        if (action === 'delete') {
            const indexToRemove = allCheckboxes.findIndex(cb =>
                cb.id === `checkbox-${hintType === 'personal' ? '' : 'general-'}${hintKey}`
            );
            
            if (indexToRemove !== -1) {
                allHintItems[indexToRemove].remove();
            }
            
            const remainingKeys = container.querySelectorAll('.hint-item');
            if (remainingKeys.length === 0) {
                container.remove();
                return;
            }
            
            // Выбираем первый оставшийся чекбокс как активный
            const newActiveCheckbox = container.querySelector('input[type="checkbox"]');
            const newActiveItem = newActiveCheckbox.closest('.hint-item');
            
            allCheckboxes.forEach(cb => cb.checked = false);
            allHintItems.forEach(item => item.classList.remove('active'));
            
            newActiveCheckbox.checked = true;
            newActiveItem.classList.add('active');
        } else {
            // Деактивируем все чекбоксы
            allCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.closest('.hint-item').classList.remove('active');
            });
            
            // Приоритет для personal (hints.json)
            let personalCheckbox = allCheckboxes.find(
                checkbox => checkbox.id === `checkbox-${hintKey}`
            );
            
            // Если personal чекбокс не найден, ищем general
            if (!personalCheckbox) {
                personalCheckbox = allCheckboxes.find(
                    checkbox => checkbox.id === `checkbox-general-${hintKey}`
                );
            }
            
            // Активируем найденный чекбокс
            if (personalCheckbox) {
                personalCheckbox.checked = true;
                personalCheckbox.closest('.hint-item').classList.add('active');
            }
        }
    })
    .catch(error => console.error('Error:', error));
}

function deleteHint(chatId, hintKey, hintType = 'personal') {
    updateHintCheckbox(chatId, hintKey, 'delete', hintType);
}

function saveHint(chatIdToUse, messageCount, hintType = 'personal') {
    const newHintInput = document.getElementById(hintType === 'personal' ? 'hint-input' : 'general-hint-input');
    const newHintKey = newHintInput.value.trim();
    
    if (!newHintKey) {
        alert('Пожалуйста, введите ключ');
        return;
    }

    fetch('/add-hint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatIdToUse,
            hint_key: newHintKey,
            message_count: messageCount,
            hint_type: hintType  // Новый параметр
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const fullHintKey = data.full_hint_key;
            const hintsContainer = document.getElementById('hints-container');
            
            if (hintsContainer) {
                const newHintHtml = `
                    <div class="hint-item ${hintType === 'general' ? 'general-hint' : ''}">
                        <div class="hint-wrapper">
                            <input type="checkbox" 
                                id="checkbox-${hintType === 'general' ? 'general-' : ''}${fullHintKey}" 
                                onchange="updateHintCheckbox('${chatIdToUse}', '${fullHintKey}', 'update', '${hintType}')"
                                class="hint-checkbox">
                            <label for="checkbox-${hintType === 'general' ? 'general-' : ''}${fullHintKey}" 
                            class="hint-label ${hintType === 'general' ? 'hint-label general' : ''}">${fullHintKey}</label>
                            <button 
                                class="hint-delete-btn" 
                                onclick="deleteHint('${chatIdToUse}', '${fullHintKey}', '${hintType}')"
                                aria-label="Delete hint">
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 64 64">
                                        <rect width="48" height="10" x="7" y="7" fill="#f9e3ae" rx="2" ry="2"></rect>
                                        <rect width="36" height="4" x="13" y="55" fill="#f9e3ae" rx="2" ry="2"></rect>
                                        <path fill="#c2cde7" d="M47 55L15 55 10 17 52 17 47 55z"></path>
                                        <path fill="#ced8ed" d="M25 55L15 55 10 17 24 17 25 55z"></path>
                                        <path fill="#b5c4e0" d="M11,17v2a3,3 0,0,0 3,3H38L37,55H47l5-38Z"></path>
                                        <path fill="#8d6c9f" d="M16 10a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V11A1 1 0 0 0 16 10zM11 10a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V11A1 1 0 0 0 11 10zM21 10a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V11A1 1 0 0 0 21 10zM26 10a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V11A1 1 0 0 0 26 10zM31 10a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V11A1 1 0 0 0 31 10zM36 10a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V11A1 1 0 0 0 36 10zM41 10a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V11A1 1 0 0 0 41 10zM46 10a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V11A1 1 0 0 0 46 10zM51 10a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V11A1 1 0 0 0 51 10z"></path>
                                        <path fill="#8d6c9f" d="M53,6H9A3,3 0 0 0 6 9v6a3,3 0 0 0 3 3c0,.27 4.89 36.22 4.89 36.22A3 3 0 0 0 15 60H47a3,3 0 0 0 1.11 -5.78l2.28 -17.3a1 1 0 0 0 .06 -.47L52.92 18H53a3,3 0 0 0 3 -3V9A3,3 0 0 0 53 6ZM24.59 18l5 5 -4.78 4.78a1 1 0 1 0 1.41 1.41L31 24.41 37.59 31 31 37.59l-7.29 -7.29h0l-5.82 -5.82a1 1 0 0 0 -1.41 1.41L21.59 31l-7.72 7.72L12.33 27.08 21.41 18Zm16 0 3.33 3.33a1 1 0 0 0 1.41 -1.41L43.41 18h7.17L39 29.59 32.41 23l5 -5Zm-11 21L23 45.59l-5.11 -5.11a1 1 0 0 0 -1.41 1.41L21.59 47l-5.86 5.86L14.2 41.22l8.8 -8.8Zm7.25 4.42L32.41 39 39 32.41l5.14 5.14a1 1 0 0 0 1.41 -1.41L40.41 31 47 24.41l2.67 2.67 -1.19 9L38.3 46.28h0L31 53.59 24.41 47 31 40.41l4.42 4.42a1 1 0 0 0 1.41 -1.41ZM23 48.41 28.59 54H17.41Zm16 0L44.59 54H33.41ZM40.41 47 48 39.37 46.27 52.86ZM50 24.58 48.41 23l2.06 -2.06Zm-19 -3L27.41 18h7.17Zm-19.47 -.64L13.59 23 12 24.58Zm3.47 .64L11.41 18h7.17ZM47 58H15a1,1 0 0 1 0 -2H47a1,1 0 0 1 0 2Zm7 -43a1,1 0 0 1 -1 1H9a1,1 0 0 1 -1 -1V9A1,1 0 0 1 9 8H53a1,1 0 0 1 1 1Z"></path>
                                        </svg>
                            </button>
                        </div>
                    </div>
                `;
                
                hintsContainer.insertAdjacentHTML('beforeend', newHintHtml);
                newHintInput.value = ''; 
            }
        } else {
            alert(data.message || 'Не удалось добавить ключ');
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при добавлении ключа');
    });
}

function processContentLoader(button, messageData, client_id) {
    const data = {
        message_id: messageData.message_id,
        sender_id: messageData.sender_id,
        client_id: client_id,
    };

    fetch('/process_content_loader', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateActiveButton(button.dataset.number);
            localStorage.setItem('activeButtonNumber', button.dataset.number);
        }
    })
    .catch(error => console.error('Error processing message:', error));
}

function updateActiveButton(activeNumber) {
    const buttons = document.querySelectorAll('.message-button');
    buttons.forEach(button => {
        if (button.dataset.number === activeNumber) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const setupModal = (config) => {
        const { 
            addBtn, 
            saveBtn, 
            modal, 
            closeBtn, 
            inputField 
        } = config;

        const toggleModal = (show = false) => {
            modal.classList.toggle('hidden', !show);
            if (inputField) inputField.value = '';
        };

        addBtn.addEventListener('click', () => toggleModal(true));
        saveBtn?.addEventListener('click', () => toggleModal());
        closeBtn.addEventListener('click', () => toggleModal());

        // Закрытие модального окна при клике вне его
        modal.addEventListener('click', (event) => {
            if (event.target === modal) toggleModal();
        });
    };

    setupModal({
        addBtn: document.getElementById('add-hint-btn'),
        saveBtn: document.getElementById('save-hint-btn'),
        modal: document.getElementById('hint-modal'),
        closeBtn: document.getElementById('close-modal-btn'),
        inputField: document.getElementById('hint-input')
    });

    setupModal({
        addBtn: document.getElementById('add-general-hint-btn'),
        saveBtn: document.getElementById('save-general-hint-btn'),
        modal: document.getElementById('hint-modal-general'),
        closeBtn: document.getElementById('close-general-modal-btn'),
        inputField: document.getElementById('general-hint-input')
    });

    const activeNumber = localStorage.getItem('activeButtonNumber') || '1';
    updateActiveButton(activeNumber);
});

