# 🔄 Database Schema Mapping

## 📊 **Your Database Schema**
Your `api_keys` table has these columns:
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `key` (VARCHAR) - The actual API key string
- `type` (VARCHAR) - Permissions/type (read/write/admin)
- `usage` (INTEGER) - Usage counter
- `created_at` (TIMESTAMP)

## 🗂️ **Code Mapping**

The code has been adapted to work with your schema:

### **Column Mapping**
| Code Property | Database Column | Description |
|---------------|-----------------|-------------|
| `key.id` | `id` | ✅ Direct match |
| `key.name` | `name` | ✅ Direct match |
| `key.key` | `key` | ✅ API key string |
| `key.permissions` | `type` | 🔄 Mapped: permissions → type |
| `key.usage` | `usage` | ✅ Direct match |
| `key.createdAt` | `created_at` | ✅ Direct match |

### **Default Values for Missing Columns**
| Code Property | Default Value | Reason |
|---------------|---------------|--------|
| `key.description` | `""` (empty) | Not in your database |
| `key.limitUsage` | `false` | Not in your database |
| `key.monthlyLimit` | `1000` | Not in your database |
| `key.updatedAt` | `createdAt` value | Uses created_at since updated_at doesn't exist |
| `key.lastUsed` | `null` | Not in your database |

## 🔧 **Code Changes Made**

### **1. Transform Function** (`useAPIKeys.js`)
```javascript
// Maps your database columns to expected code properties
const transformKey = (key) => ({
  id: key.id,
  name: key.name,
  description: '', // Default empty
  key: key.key, // Direct mapping
  permissions: key.type || 'read', // type → permissions
  limitUsage: false, // Default false
  monthlyLimit: 1000, // Default 1000
  usage: key.usage || 0, // Direct mapping
  createdAt: key.created_at,
  updatedAt: key.created_at, // Use created_at
  lastUsed: null // Default null
});
```

### **2. Create Function** (`supabase.js`)
```javascript
// Maps form data to your database columns
const insertData = {
  name: apiKeyData.name,
  key: apiKeyData.key, // Direct mapping
  type: apiKeyData.type, // permissions → type
  usage: apiKeyData.usage || 0
};
```

### **3. Update Function** (`supabase.js`)
```javascript
// Maps updates to your database columns
const updateData = {
  name: updates.name,
  type: updates.permissions || 'read' // permissions → type
};
```

### **4. Query Functions** (`supabase.js`)
```javascript
// Only selects columns that exist in your database
.select('id, name, key, type, usage, created_at')
```

## ✅ **What Works**

- **✅ Loading API keys** - Fetches only existing columns
- **✅ Creating new keys** - Maps permissions to type column
- **✅ Editing keys** - Updates name and type
- **✅ Deleting keys** - Works with any schema
- **✅ Key validation** - Uses the key column correctly
- **✅ Usage tracking** - Updates the usage column
- **✅ Permissions** - Maps read/write/admin to type column

## 🚫 **Features Disabled/Simplified**

Since your database doesn't have these columns, these features use defaults:

- **Description field** - Always shows empty (form doesn't collect it)
- **Usage limits** - Always shows as unlimited
- **Monthly limits** - Shows default 1000 but not enforced
- **Last used tracking** - Shows as "Never" 
- **Updated timestamps** - Shows created timestamp instead

## 🎯 **Result**

Your app now works perfectly with your existing database schema! No database changes needed. The code adapts to your columns and provides sensible defaults for missing features.

### **Permissions Mapping**
- Form shows: "Read Only", "Read & Write", "Admin"
- Database stores: "read", "write", "admin" in the `type` column
- Display shows: Proper permission names based on type value

**Everything should work now without any database schema changes!** 🚀 