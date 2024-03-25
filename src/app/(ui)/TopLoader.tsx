"use client";

// Initially based on https://github.com/TheSGJ/nextjs-toploader
// (Copied here in order to add CSP nonce)

import NProgress from "nprogress";
import { useEffect } from "react";

/**
 *
 * NextTopLoader
 *
 */
export const TopLoader = () => {
  /**
   * Convert the url to Absolute URL based on the current window location.
   * @param url {string}
   * @returns {string}
   */
  const toAbsoluteURL = (url: string): string => {
    return new URL(url, window.location.href).href;
  };

  /**
   * Check if it is hash anchor or same page anchor
   * @param currentUrl {string} Current Url Location
   * @param newUrl {string} New Url detected with each anchor
   * @returns {boolean}
   */
  const isHashAnchor = (currentUrl: string, newUrl: string): boolean => {
    const current = new URL(toAbsoluteURL(currentUrl));
    const next = new URL(toAbsoluteURL(newUrl));
    return current.href.split("#")[0] === next.href.split("#")[0];
  };

  /**
   * Check if it is Same Host name
   * @param currentUrl {string} Current Url Location
   * @param newUrl {string} New Url detected with each anchor
   * @returns {boolean}
   */
  const isSameHostName = (currentUrl: string, newUrl: string): boolean => {
    const current = new URL(toAbsoluteURL(currentUrl));
    const next = new URL(toAbsoluteURL(newUrl));
    return (
      current.hostname.replace(/^www\./, "") ===
      next.hostname.replace(/^www\./, "")
    );
  };

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      trickle: true,
      trickleSpeed: 200,
      minimum: 0.08,
      easing: "ease",
      speed: 200,
      template:
        '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
    });

    /**
     * Check if the Current Url is same as New Url
     * @param currentUrl {string}
     * @param newUrl {string}
     * @returns {boolean}
     */
    function isAnchorOfCurrentUrl(currentUrl: string, newUrl: string): boolean {
      const currentUrlObj = new URL(currentUrl);
      const newUrlObj = new URL(newUrl);
      // Compare hostname, pathname, and search parameters
      if (
        currentUrlObj.hostname === newUrlObj.hostname &&
        currentUrlObj.pathname === newUrlObj.pathname &&
        currentUrlObj.search === newUrlObj.search
      ) {
        // Check if the new URL is just an anchor of the current URL page
        const currentHash = currentUrlObj.hash;
        const newHash = newUrlObj.hash;
        return (
          currentHash !== newHash &&
          currentUrlObj.href.replace(currentHash, "") ===
            newUrlObj.href.replace(newHash, "")
        );
      }
      return false;
    }

    // deno-lint-ignore no-var
    var nProgressClass: NodeListOf<HTMLHtmlElement> =
      document.querySelectorAll("html");

    const removeNProgressClass = (): void =>
      nProgressClass.forEach((el: Element) =>
        el.classList.remove("nprogress-busy"),
      );

    /**
     * Find the closest anchor to trigger
     * @param element {HTMLElement | null}
     * @returns element {Element}
     */
    function findClosestAnchor(
      element: HTMLElement | null,
    ): HTMLAnchorElement | null {
      while (element && element.tagName.toLowerCase() !== "a") {
        element = element.parentElement;
      }
      return element as HTMLAnchorElement;
    }

    /**
     *
     * @param event {MouseEvent}
     * @returns {void}
     */
    function handleClick(event: MouseEvent): void {
      if (event.button !== 0) {
        // We only care about left clicks
        return;
      }
      try {
        const target = event.target as HTMLElement;
        const anchor = findClosestAnchor(target);
        const newUrl = anchor?.href;
        if (newUrl) {
          const currentUrl = window.location.href;
          // const newUrl = (anchor as HTMLAnchorElement).href;
          const isExternalLink =
            (anchor as HTMLAnchorElement).target === "_blank";

          // Check for Special Schemes
          const isSpecialScheme = [
            "tel:",
            "mailto:",
            "sms:",
            "blob:",
            "download:",
          ].some((scheme) => newUrl.startsWith(scheme));

          const isAnchor: boolean = isAnchorOfCurrentUrl(currentUrl, newUrl);
          const notSameHost = !isSameHostName(
            window.location.href,
            anchor.href,
          );
          if (notSameHost) {
            return;
          }
          if (
            newUrl === currentUrl ||
            isAnchor ||
            isExternalLink ||
            isSpecialScheme ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey ||
            isHashAnchor(window.location.href, anchor.href) ||
            !toAbsoluteURL(anchor.href).startsWith("http")
          ) {
            NProgress.start();
            NProgress.done();
            removeNProgressClass();
          } else {
            NProgress.start();
          }
        }
      } catch (err) {
        // Log the error in development only!
        // console.log('NextTopLoader error: ', err);
        NProgress.start();
        NProgress.done();
      }
    }

    /**
     * Complete TopLoader Progress
     * @param {History}
     * @returns {void}
     */
    ((history: History): void => {
      const pushState = history.pushState;
      history.pushState = (...args) => {
        NProgress.done();
        removeNProgressClass();
        return pushState.apply(history, args);
      };
    })((window as Window).history);

    function handlePageHide(): void {
      NProgress.done();
      removeNProgressClass();
    }

    /**
     * Handle Browser Back and Forth Navigation
     * @returns {void}
     */
    function handleBackAndForth(): void {
      NProgress.done();
    }

    // Add the global click event listener
    window.addEventListener("popstate", handleBackAndForth);
    document.addEventListener("click", handleClick);
    window.addEventListener("pagehide", handlePageHide);

    // Clean up the global click event listener when the component is unmounted
    return (): void => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("popstate", handleBackAndForth);
    };
  }, []);

  return <></>;
};
