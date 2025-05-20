chrome.storage.local.get(null, (data) => {
  const tableBody = document.getElementById('time-table');
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);

  sorted.forEach(([site, seconds]) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${site}</td>
      <td>${seconds}</td>
    `;
    tableBody.appendChild(row);
  });
});
