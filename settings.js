document.getElementById('settingsForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const password = document.getElementById('redisPassword').value;
  const host = document.getElementById('redisHost').value || 'redis-11988.c15.us-east-1-2.ec2.cloud.redislabs.com';
  const port = parseInt(document.getElementById('redisPort').value) || 11988;

  if (!password) {
    showStatus('Redis password is required', 'error');
    return;
  }

  try {
    chrome.storage.local.set({
      redisPassword: password,
      redisHost: host,
      redisPort: port
    }, () => {
      showStatus('Settings saved successfully', 'success');
      // Auto-hide after 3 seconds
      setTimeout(() => {
        document.getElementById('status').style.display = 'none';
      }, 3000);
    });
  } catch (error) {
    showStatus('Error saving settings: ' + error.message, 'error');
  }
});

document.getElementById('testBtn').addEventListener('click', async () => {
  const password = document.getElementById('redisPassword').value;
  const host = document.getElementById('redisHost').value || 'redis-11988.c15.us-east-1-2.ec2.cloud.redislabs.com';
  const port = parseInt(document.getElementById('redisPort').value) || 11988;

  if (!password) {
    showStatus('Please enter Redis password first', 'error');
    return;
  }

  showStatus('Testing connection...', 'info');
  document.getElementById('testBtn').disabled = true;

  try {
    // Send message to background script to test connection
    chrome.runtime.sendMessage(
      { action: 'testRedisConnection', password, host, port },
      (response) => {
        document.getElementById('testBtn').disabled = false;
        if (response && response.success) {
          showStatus('Connection successful!', 'success');
        } else {
          showStatus('Connection failed: ' + (response?.error || 'Unknown error'), 'error');
        }
      }
    );
  } catch (error) {
    document.getElementById('testBtn').disabled = false;
    showStatus('Error testing connection: ' + error.message, 'error');
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all settings?')) {
    chrome.storage.local.remove(['redisPassword', 'redisHost', 'redisPort'], () => {
      document.getElementById('redisPassword').value = '';
      document.getElementById('redisHost').value = '';
      document.getElementById('redisPort').value = '11988';
      showStatus('Settings cleared', 'success');
      setTimeout(() => {
        document.getElementById('status').style.display = 'none';
      }, 3000);
    });
  }
});

// Load saved settings on page load
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['redisPassword', 'redisHost', 'redisPort'], (result) => {
    if (result.redisPassword) {
      document.getElementById('redisPassword').value = result.redisPassword;
    }
    if (result.redisHost) {
      document.getElementById('redisHost').value = result.redisHost;
    }
    if (result.redisPort) {
      document.getElementById('redisPort').value = result.redisPort;
    }
  });
});

function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = 'status ' + type;
}
