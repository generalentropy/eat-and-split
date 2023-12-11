import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Jacques",
    image: "https://i.imgur.com/w8lWXWi.jpg",
    balance: -35,
  },
  {
    id: 933372,
    name: "Lilou",
    image: "https://i.imgur.com/VsSv8G1.jpg",
    balance: 20,
  },
  {
    id: 499476,
    name: "Roch",
    image: "https://i.imgur.com/5Mhis9X.jpg",
    balance: 0,
  },

  {
    id: 46599235,
    name: "Risitas",
    image: "https://i.imgur.com/jksJY9n.jpg",
    balance: 12,
  },
];

function Button({ children, onClick, addClass }) {
  return (
    <button className={`button ${addClass}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendsList, setFriendsList] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(true);

  function handleSelection(friend) {
    setIsFormOpen(true);
    console.log(friend);
    setSelectedFriend((current) => (current?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    console.log(value);
    setFriendsList((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  function handleDeleteMode() {
    setDeleteMode((mode) => !mode);
  }

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }
  return (
    <>
      <div className="header">
        <h1>eat&split</h1>
      </div>
      <div className="app">
        {friendsList.length > 0 && (
          <Button addClass="delete" onClick={handleDeleteMode}>
            {deleteMode
              ? "Fermer le mode édition de la liste"
              : "Activer le mode édition"}
          </Button>
        )}
        <div className="sidebar">
          <FriendsList
            friendsList={friendsList}
            setFriendsList={setFriendsList}
            onSelection={handleSelection}
            selectedFriend={selectedFriend}
            deleteMode={deleteMode}
            onDeleteMode={handleDeleteMode}
            onIsFormOpen={setIsFormOpen}
          />

          {showAddFriend && (
            <FormAddFriend
              onSetFriends={setFriendsList}
              friendsList={friendsList}
              onSetShowAddFriend={handleShowAddFriend}
            />
          )}
          <Button onClick={handleShowAddFriend} addClass="bg-green">
            {showAddFriend ? "Fermer [x]" : "Ajouter un ami"}
          </Button>
        </div>
        {selectedFriend && isFormOpen && (
          <FormSplitBill
            key={selectedFriend.id}
            isFormOpen={isFormOpen}
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
          />
        )}
      </div>
    </>
  );
}

function FriendsList({
  friendsList,
  setFriendsList,
  onSelection,
  selectedFriend,
  deleteMode,
  onDeleteMode,
  onIsFormOpen,
}) {
  const renderFriends = friendsList;

  return (
    <ul>
      {renderFriends.map((friend) => (
        <Friend
          friend={friend}
          friendsList={friendsList}
          key={friend.id}
          setFriendsList={setFriendsList}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
          deleteMode={deleteMode}
          onDeleteMode={onDeleteMode}
          onIsFormOpen={onIsFormOpen}
        />
      ))}
    </ul>
  );
}

function Friend({
  friend,
  onSelection,
  selectedFriend,
  deleteMode,
  friendsList,
  onDeleteMode,
  setFriendsList,
  onIsFormOpen,
}) {
  const isSelected = friend.id === selectedFriend?.id;

  function handleDeleteFriend(friend) {
    const friends = friendsList;
    const updatedFriendList = friends.filter((f) => f.id !== friend.id);
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ?");

    if (confirmed) setFriendsList(updatedFriendList);
    onIsFormOpen(false);

    console.log(updatedFriendList.length === 0);

    if (updatedFriendList.length === 0) onDeleteMode(false);
  }
  return (
    <li className={isSelected ? "selected" : undefined}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          Je dois <strong>{Math.abs(friend.balance)}€</strong> à {friend.name}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} me doit <strong>{Math.abs(friend.balance)}€</strong>
        </p>
      )}
      {friend.balance === 0 && <p>Tout roule 👍</p>}
      {
        // passe l'objet friend
      }
      <div>
        <Button onClick={() => onSelection(friend)}>
          {isSelected ? "Fermer [x] " : "Partager"}
        </Button>
        {deleteMode && (
          <Button
            onClick={() => handleDeleteFriend(friend)}
            addClass="delete-friend"
          >
            X
          </Button>
        )}
      </div>
    </li>
  );
}

function FormAddFriend({ onSetFriends, friendsList, onSetShowAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.imgur.com/mcwdBeS.jpg");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const newFriend = { id: crypto.randomUUID(), name, image, balance: 0 };
    const updatedList = [...friendsList, newFriend];
    onSetFriends(updatedList);

    setName("");
    setImage("https://i.imgur.com/mcwdBeS.jpg");
    onSetShowAddFriend(false);
  }

  return (
    <form className="form-add-friend">
      <label>😎Prénom</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>

      <label>🖼️URL de la photo</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>

      <Button onClick={handleSubmit}>Ajouter</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUSer] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function isNumber(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByFriend) return;

    console.log(paidByFriend);
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Partager avec {selectedFriend.name}</h2>

      <label>🧾Montant de la note</label>
      <input
        type="number"
        value={bill}
        onChange={(e) =>
          isNumber(Number(e.target.value)) && setBill(Number(e.target.value))
        }
      ></input>

      <label>💰 Ma part</label>
      <input
        type="number"
        value={paidByUser}
        onChange={(e) =>
          isNumber(Number(e.target.value)) &&
          setPaidByUSer(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      ></input>

      <label>💰 Part de {selectedFriend.name}</label>
      <input
        type="text"
        disabled
        value={paidByFriend < 0 ? "0" : paidByFriend}
      ></input>

      <label>🤑Qui règle la note ?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">Moi</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Valider</Button>
    </form>
  );
}
