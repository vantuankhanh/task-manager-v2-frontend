import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "rsuite/dist/rsuite-no-reset.min.css";
import App from "@/App";
import LoadingLazy from "@/components/commons/loading/loading-lazy";
import { store } from "@/libs/store/store";
import "@/styles/index.css";
import "@/styles/layout/layout.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Suspense fallback={<LoadingLazy />}>
        <App />
      </Suspense>
    </BrowserRouter>
  </Provider>,
);
