// @project/ui — Reusable primitives, providers & quality components

// Tier 1 Primitives (12 adet)
export {
  Text,
  Heading,
  Box,
  Stack,
  Inline,
  Spacer,
  Pressable,
  Icon,
  Divider,
  ScrollContainer,
  SafeAreaContainer,
  KeyboardAvoidingContainer,
} from './primitives';

// Providers
export { ThemeProvider, useTheme } from './providers';

// Quality Baseline
export { ErrorBoundary } from './quality/ErrorBoundary';
export { AuthGuard, type AuthStatus } from './quality/AuthGuard';
export { ScreenContainer } from './quality/ScreenContainer';

// Tier 2-3 Components (26 adet)
export {
  // Form (6)
  Button,
  IconButton,
  TextField,
  FieldShell,
  Switch,
  Select,
  // Feedback (2)
  Toast,
  Banner,
  // State (6)
  Skeleton,
  Spinner,
  ProgressBar,
  EmptyState,
  ErrorState,
  LoadingState,
  // Data Display (7)
  Avatar,
  Badge,
  Chip,
  Card,
  ListItem,
  SectionHeader,
  KeyValueRow,
  // Overlay (5)
  Modal,
  ConfirmDialog,
  BottomSheet,
  ActionSheet,
  Drawer,
  // Input (5)
  PasswordField,
  PhoneInput,
  SearchBar,
  DatePicker,
  Slider,
  // Navigation (2)
  StepIndicator,
  SegmentedControl,
  // Utility (4)
  Accordion,
  CountdownTimer,
  WebViewPlaceholder,
  DividerWithLabel,
} from './components';
