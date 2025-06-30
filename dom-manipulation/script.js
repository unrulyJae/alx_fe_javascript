// === Simulated Dynamic Quote Generator with Sync ===

const displayQuote = document.getElementById("quoteDisplay");
const quoteBtn = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");
const categoryFilter = document.getElementById("categoryFilter");
const serverURL = "https://jsonplaceholder.typicode.com/posts"; // Mock API

let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { category: "Inspiration", text: "Happiness is not something ready made. It comes from your own actions." },
    { category: "Love", text: "You, yourself, as much as anybody in the entire universe, deserve your love and affection." },
    { category: "Motivational", text: "The only person you are destined to become is the person you decide to be." },
    { category: "Funny", text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe." }
];

const saveQuotes = () => {
    localStorage.setItem("quotes", JSON.stringify(quotes));
};

const populateCategories = () => {
    categoryFilter.innerHTML = "";
    const option = document.createElement("option");
    option.value = "all";
    option.textContent = "All Categories";
    categoryFilter.appendChild(option);
    const uniqueCategory = [...new Set(quotes.map(q => q.category))];
    uniqueCategory.forEach(category => {
        const opt = document.createElement("option");
        opt.value = category;
        opt.textContent = category;
        categoryFilter.appendChild(opt);
    });
};

const filterQuotes = () => {
    displayQuote.innerHTML = "";
    const selectedCategory = categoryFilter.value;
    const filtered = selectedCategory === "all"
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);
    if (filtered.length === 0) {
        displayQuote.textContent = "No quotes available in this category.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * filtered.length);
    displayQuote.textContent = filtered[randomIndex].text;
};

const showRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    displayQuote.innerHTML = `"${quotes[randomIndex].text}" — ${quotes[randomIndex].category}`;
};

const createAddQuoteForm = () => {
    if (document.getElementById("newQuoteText")) return;
    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.id = "newQuoteText";
    textInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.id = "newQuoteCategory";
    categoryInput.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.id = "addQuoteBtn";
    addButton.addEventListener("click", addQuote);

    formContainer.appendChild(textInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
};

const addQuote = () => {
    const newQuote = document.getElementById("newQuoteText").value.trim();
    const newCategory = document.getElementById("newQuoteCategory").value.trim();
    if (!newQuote || !newCategory) return alert("Please fill in both fields.");
    const quoteObj = { text: newQuote, category: newCategory };
    quotes.push(quoteObj);
    saveQuotes();
    populateCategories();
    sendQuoteToServer(quoteObj);
    alert("Quote added successfully!");
};

const sendQuoteToServer = async (quote) => {
    try {
        await fetch(serverURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(quote)
        });
        console.log("Quote sent to server.");
    } catch (error) {
        console.error("Failed to send quote to server.", error);
    }
};

const syncQuotes = async () => {
    try {
        const serverQuotes = await fetchQuotesFromServer();
        let newQuotes = serverQuotes.filter(sq => !quotes.some(lq => lq.text === sq.text));
        if (newQuotes.length > 0) {
            quotes.push(...newQuotes);
            saveQuotes();
            alert("Quotes synced with server!");
            populateCategories();
        }
    } catch (err) {
        console.error("Failed to sync from server", err);
    }
};

function fetchQuotesFromServer() {
    return fetch(serverURL)
        .then(res => res.json())
        .then(serverData => serverData.slice(0, 5).map(post => ({
            text: post.title,
            category: "Synced"
        })));
}

// Run initializers
quoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", filterQuotes);
createAddQuoteForm();
populateCategories();
showRandomQuote();

// Sync every 30 seconds
setInterval(syncQuotes, 30000);
