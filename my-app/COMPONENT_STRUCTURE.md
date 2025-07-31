# 🏗️ Component Structure & Organization

This project has been refactored into a clean, modular component architecture for better maintainability and understanding.

## 📁 Folder Structure

```
src/
├── hooks/                     # Custom React hooks
│   ├── useToast.js           # Toast notification state & logic
│   ├── useTheme.js           # Dark/light mode state & persistence
│   └── useAPIKeys.js         # API keys CRUD operations & state
├── components/
│   ├── ui/                   # Reusable UI components
│   │   ├── Toast.js          # Toast notification display
│   │   ├── Modal.js          # Modal wrapper component
│   │   └── ErrorMessage.js   # Error display with help text
│   └── dashboard/            # Dashboard-specific components
│       ├── Sidebar.js        # Navigation sidebar
│       ├── Header.js         # Top header with breadcrumb & controls
│       ├── PlanCard.js       # Current plan display card
│       ├── APIKeyTable.js    # API keys table with actions
│       └── APIKeyForm.js     # Create/edit API key form
├── app/
│   ├── lib/
│   │   └── supabase.js       # Supabase client & services
│   └── api-keys/
│       └── page.js           # Main page (now clean & simple)
└── globals.css               # Global styles
```

## 🎣 Custom Hooks

### `useToast()`
**Purpose**: Manages toast notification state and auto-dismissal
```javascript
const { toast, showToast, hideToast } = useToast();
```
- `toast`: Current toast object `{ message, type }`
- `showToast(message, type)`: Show a toast (auto-dismisses in 3s)
- `hideToast()`: Manually dismiss toast

### `useTheme()`
**Purpose**: Manages dark/light mode with localStorage persistence
```javascript
const { isDarkMode, toggleDarkMode } = useTheme();
```
- `isDarkMode`: Boolean for current theme
- `toggleDarkMode()`: Switch between themes

### `useAPIKeys(showToast)`
**Purpose**: Handles all API key CRUD operations and state
```javascript
const { 
  apiKeys, loading, error, setError,
  createApiKey, updateApiKey, deleteApiKey, 
  testConnectionHandler 
} = useAPIKeys(showToast);
```
- Manages API keys array, loading states, and errors
- Provides CRUD functions that integrate with Supabase
- Automatically shows toast notifications for operations

## 🧩 UI Components

### `<Toast />`
**Purpose**: Displays notifications at the top of the screen
- Auto-dismisses after 3 seconds
- Manual dismiss with X button
- Success (green) and error (red) variants
- Dark mode support

### `<Modal />`
**Purpose**: Reusable modal wrapper
- Backdrop overlay
- Title and subtitle support
- Dark mode styling
- Children content area

### `<ErrorMessage />`
**Purpose**: Smart error display with contextual help
- Shows helpful tips based on error type
- Test connection button
- Environment variable setup guidance
- Database setup hints

## 🏠 Dashboard Components

### `<Sidebar />`
**Purpose**: Left navigation menu
- Logo and branding
- Navigation items with icons
- User profile section
- Active state highlighting
- Dark mode support

### `<Header />`
**Purpose**: Top header bar
- Breadcrumb navigation
- Page title
- Status indicator
- Dark mode toggle button

### `<PlanCard />`
**Purpose**: Current plan display
- Gradient background
- Usage progress bar
- Plan information
- Manage plan button

### `<APIKeyTable />`
**Purpose**: Main data table for API keys
- Loading states
- Empty states
- Key visibility toggle (eye button)
- Action buttons (copy, edit, delete)
- Test connection button
- Create new button

### `<APIKeyForm />`
**Purpose**: Create/edit API key modal form
- Dynamic title based on create/edit mode
- Form validation
- Auto-populated fields when editing
- Submit and cancel actions

## 🔄 Data Flow

1. **Page Load**: `useAPIKeys` hook loads data from Supabase
2. **User Actions**: Components call hook functions (create, update, delete)
3. **API Operations**: Hook functions interact with Supabase services
4. **State Updates**: Hook updates local state and shows toasts
5. **UI Updates**: Components re-render with new data

## ✨ Benefits of This Architecture

### **Separation of Concerns**
- Logic separated from UI
- Each component has a single responsibility
- Hooks manage state and side effects

### **Reusability**
- UI components can be used across different pages
- Hooks can be shared between components
- Consistent styling and behavior

### **Maintainability**
- Easy to find and modify specific functionality
- Clear file organization
- Type-safe interfaces between components

### **Testability**
- Hooks can be tested independently
- Components have clear props interface
- Mock data easy to inject

### **Developer Experience**
- Clear imports show dependencies
- Smaller files are easier to understand
- Logical grouping of related code

## 🚀 Usage Examples

### Adding a New Feature
1. Create hook for state management (if needed)
2. Create UI components
3. Wire them together in the page component

### Modifying Styling
1. Update component files in `components/`
2. Use Tailwind classes with dark mode variants
3. Consistent with existing design patterns

### Adding New API Endpoints
1. Add service functions to `lib/supabase.js`
2. Update or create new hooks to use services
3. Components automatically get new functionality

This architecture makes the codebase much more maintainable and easier to understand! 🎉 