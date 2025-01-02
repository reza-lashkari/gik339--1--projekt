// URL för REST API
const url = "http://localhost:3000/books";

// DOM-element
const booksContainer = document.getElementById('Books');
const saveButton = document.getElementById('saveButton');
const clearButton = document.getElementById('clearButton');

// Funktion för att hämta och visa böcker
function fetchBooks() {
  fetch(url)
    .then((response) => response.json())
    .then((books) => {
      console.log(books); // Kontrollera att data hämtas korrekt

      if (Array.isArray(books) && books.length > 0) {
        let html = `<ul style="display: flex; flex-wrap: wrap; gap: 1rem; justify-content: center; list-style-type: none; padding: 0;">`;

        books.forEach((book) => {
          html += `
            <div id="book-${book.id}" class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-3" style="list-style: none;">
              <div class="books" style="
                background-color: #A76FB4;
                padding: 2rem;
                border-radius: 1rem;
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                border: 0.2rem solid #000000;
                font-size: 1.2rem;">
                <p><strong>Titel:</strong> ${book.Titel}</p>
                <p><strong>Författare:</strong> ${book.Författare}</p>
                <p><strong>Genre:</strong> ${book.Gener}</p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                  <button class="btn btn-primary" onclick="deleteBook(${book.id})" style="background-color: #FF6347; color: white; border-radius: 0.5rem;">Ta bort</button>
                  <button class="btn btn-primary" onclick="updateBook(${book.id})" style="background-color: #FF6347; color: white; border-radius: 0.5rem;">Ändra</button>
                </div>
              </div>
            </div>`;
        });

        html += `</ul>`;

        const listContainer = document.getElementById('Books');
        listContainer.innerHTML = ''; // Töm container innan vi sätter ny HTML
        listContainer.insertAdjacentHTML('beforeend', html); // Lägg till HTML
      } else {
        console.log('Ingen bok att visa');
      }
    })
    .catch((error) => console.error('Error fetching books:', error));
}

// Hämta böcker när sidan laddas
window.addEventListener('load', fetchBooks);

// Lägg till en ny bok
saveButton.addEventListener('click', () => {
  const Titel = document.getElementById('Titel').value;
  const Författare = document.getElementById('Författare').value;
  const Genre = document.getElementById('Genre').value;

  if (Titel && Författare && Genre) {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Titel, Författare, Gener: Genre })
    })
      .then(response => response.text())
      .then(message => {
        console.log(message);

        // Rensa fälten efter sparande
        document.getElementById('Titel').value = '';
        document.getElementById('Författare').value = '';
        document.getElementById('Genre').value = '';  // Kontrollera detta

        // Visa modal efter sparande
        const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
        modal.show();

        // Uppdatera boklistan utan att ladda om sidan
        fetchBooks();
      })
      .catch(error => console.error('Error:', error));
  } else {
    alert('Fyll i alla fält innan du sparar!');
  }
});

// Uppdatera en bok
function updateBook(bookId) {
  

  const updatedBook = {
    id: bookId,
    Titel: document.getElementById('Titel').value,
    Författare: document.getElementById('Författare').value,
    Gener: document.getElementById('Genre').value,
  };

  fetch(`${url}/${bookId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedBook),
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
      
      // Uppdatera boklistan utan att ladda om sidan
      fetchBooks();
    })
    .catch((error) => console.error('Error updating book:', error));
}

function deleteBook(bookId) {
fetch(`${url}/${bookId}`, {
    method: 'DELETE',
  })
    .then((result) => fetchBooks());
}

// Rensa formulär
  document.getElementById('Titel').value = '';
  document.getElementById('Författare').value = '';
  document.getElementById('Genre').value = '';
