# Dashboard Foundation Architecture

## Component Responsibility
The dashboard is built on a heavily decoupled architecture where presentational components (`src/components/dashboard/`) are completely separated from data fetching and business logic. Each card is responsible ONLY for receiving props defined in `src/types/dashboard.ts` and rendering them according to the Tatvam premium design system using Framer Motion and GlassCard primitives.

## Data Flow
Currently, `src/app/(dashboard)/page.tsx` acts as the primary data controller. 
1. It imports structured placeholder data from `src/components/dashboard/mock/`.
2. It explicitly distributes this data via props to each dashboard module (e.g., `<ContinueLearningCard data={data.continueLearning} />`).
3. Individual components never fetch data themselves, nor do they mutate it.

## Future API Mapping
When backend integration begins in future phases:
- We will implement data fetching hooks in `src/hooks/dashboard/` (e.g., `useDashboardData`).
- We will construct API service calls in `src/services/dashboard/`.
- `page.tsx` will swap its static `mockData` import for the React Query hook. 
- While data is fetching, it will render `<DashboardSkeletons />`.
- If data is empty, the presentational components are already wired to display `<NoActivity />`, `<NoInsight />`, etc.
- No presentational components will need to be refactored to support the API.
