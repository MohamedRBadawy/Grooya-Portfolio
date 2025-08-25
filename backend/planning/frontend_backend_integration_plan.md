# Frontend to Backend Integration Plan

This document outlines the architectural strategy for connecting the React frontend application to a Django backend API. The goal is to ensure a smooth, organized, and scalable transition from mock data to live data.

---

## The Core Strategy: The Repository Pattern

The most important architectural decision is that all data-fetching and manipulation logic is centralized in a single file: `DataContext.tsx`. The rest of the application's components (e.g., `PortfolioListPage.tsx`, `PortfolioEditorPage.tsx`) are completely unaware of the data's origin. They simply call functions like `useData().portfolios` or `useData().updatePortfolio(someData)`.

This `DataContext` acts as a **"repository"** or an **"abstraction layer"**. Currently, its data source is the mock data file. To connect to the backend, we only need to **swap out the implementation logic inside this one file** from reading mock data to making live API calls.

**The Major Advantage:** This clean separation of concerns means that when we switch to the live backend, we will not have to modify any other component in the application, saving significant development time and reducing the risk of bugs.

---

## The Transition from Mock Data to Live API

The process involves two primary changes within `DataContext.tsx`:

1.  **Fetching Initial Data:** Instead of initializing state from `localStorage` or `initialPortfolios`, we will use a `useEffect` hook to fetch data from the API endpoints when the application first loads.

2.  **Updating Data:** Instead of just updating local React state (e.g., `setPortfolios(...)`), the data manipulation functions (`updatePortfolio`, `createProject`, etc.) will first send a request to the backend (using `PATCH`, `POST`, `DELETE`) and then update the local state based on the successful response from the server.

---

## Example Walkthrough: `DataContext.tsx`

Let's look at a "before and after" for the `portfolios` state to make the concept perfectly clear.

### Before (Current Mock Data Implementation):

```typescript
// in DataContext.tsx

// ...
const PORTFOLIOS_STORAGE_KEY = 'grooya_portfolios';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. State is initialized directly from localStorage or mock data
  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => {
    try {
      const stored = window.localStorage.getItem(PORTFOLIOS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialPortfolios;
    } catch (error) {
      return initialPortfolios;
    }
  });

  // 2. useEffect just saves the local state back to localStorage
  useEffect(() => {
    window.localStorage.setItem(PORTFOLIOS_STORAGE_KEY, JSON.stringify(portfolios));
  }, [portfolios]);

  // 3. updatePortfolio only changes the local React state
  const updatePortfolio = (updatedPortfolio: Portfolio) => {
    const portfolioWithTimestamp = { ...updatedPortfolio, updatedAt: Date.now() };
    setPortfolios(prev => 
      prev.map(p => p.id === portfolioWithTimestamp.id ? portfolioWithTimestamp : p)
    );
  };
  // ...
};
```

### After (Future Live API Implementation):

This is what the code will look like once it's connected to the planned Django backend.

```typescript
// in DataContext.tsx

// ... (No need for PORTFOLIOS_STORAGE_KEY anymore)

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. State is initialized as an empty array.
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state for better UX

  // 2. useEffect now fetches from the API on initial component mount
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        // Assuming JWT token is handled by a helper or interceptor
        const response = await fetch('/api/portfolios/'); 
        if (!response.ok) throw new Error('Failed to fetch portfolios');
        const data = await response.json();
        setPortfolios(data);
      } catch (error) {
        console.error("Error fetching portfolios:", error);
        // Here you could set an error state to display a message in the UI
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []); // Empty dependency array means this runs once

  // 3. updatePortfolio now sends a PATCH request to the backend API
  const updatePortfolio = async (updatedPortfolio: Portfolio) => {
    try {
      const response = await fetch(`/api/portfolios/${updatedPortfolio.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${getAuthToken()}` // Auth token would go here
        },
        body: JSON.stringify(updatedPortfolio),
      });

      if (!response.ok) throw new Error('Failed to update portfolio');
      
      const savedPortfolio = await response.json();

      // On successful save, update the local state to reflect the change
      setPortfolios(prev => 
        prev.map(p => p.id === savedPortfolio.id ? savedPortfolio : p)
      );

    } catch (error) {
      console.error("Error updating portfolio:", error);
      // Optional: Display a toast notification to the user on error
    }
  };
  // ...
};
```

---

## Conclusion

As you can see, the change is entirely contained within `DataContext.tsx`. The rest of the application requires no modification whatsoever. This is the power of the architecture we have chosen. When the time comes to build the backend, this is how we will seamlessly connect the two halves of the application.