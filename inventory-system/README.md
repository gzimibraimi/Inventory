# inventory-system

This project contains a React frontend and an Express backend for inventory management.

## Setup

1. Open a shell in `d:\Inventory\inventory-system`.
2. Create a `.env` file from the example:

```powershell
cd server
cp .env.example .env
```

3. Install packages:

```powershell
cd ..\client
npm install
cd ..\server
npm install
```

4. Start the backend and frontend in separate terminals:

```powershell
cd server
npm run dev
```

```powershell
cd client
npm run dev
```

## Backend features

- Excel import for inventory items
- Item filtering by status, employee, category, office, location
- Assign and release items to employees
- Generate `Revers` PDF document for an item
- PostgreSQL database schema is initialized automatically on startup

## Excel import columns

The import accepts column headers such as:

- `name`
- `serial_number`
- `category`
- `office`
- `location`
- `status`
- `assigned_to`

The application also recognizes common header variants like `Item Name`, `Serial`, `Zyra`, `Lokacion`, and `Punetor`.
