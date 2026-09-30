import { useEffect, useMemo, useState } from "react";
import { Send } from "lucide-react";

import { API_BASE_URL } from "../config/api";

function parseContent(content) {
  if (!content) return {};

  if (typeof content === "object") {
    return content;
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    console.error("FOOTER CMS CONTENT PARSE ERROR:", error);
    return {};
  }
}

export default function Footer() {
  const [cmsPage, setCmsPage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadFooterPage() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/public-cms/pages/footer`
        );

        if (!response.ok) {
          throw new Error(
            `Footer CMS request failed with status ${response.status}`
          );
        }

        const result = await response.json();

        if (mounted && result?.success) {
          setCmsPage(result.data);
        }
      } catch (error) {
        console.error("FOOTER CMS LOAD ERROR:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadFooterPage();

    return () => {
      mounted = false;
    };
  }, []);

  const sections = useMemo(() => {
    const list = cmsPage?.sections || [];

    return list.reduce((acc, section) => {
      acc[section.section_key] = section;
      return acc;
    }, {});
  }, [cmsPage]);

  const footer = sections.footer || {};

  const footerContent = useMemo(
    () => parseContent(footer.content),
    [footer.content]
  );

  async function handleCommentSubmit(event) {
    event.preventDefault();

    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      setMessage("Please enter a comment.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: trimmedComment,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Unable to submit your comment."
        );
      }

      setComment("");
      setMessage("Thank you for your comment.");
    } catch (error) {
      console.error("COMMENT SUBMIT ERROR:", error);

      setMessage(
        error.message || "Unable to submit your comment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <footer className="bg-black text-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="h-32 animate-pulse rounded-3xl bg-white/[0.04]" />
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative overflow-hidden bg-black text-white">

      {/* Very subtle luxury lighting */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-[#1479e8]/[0.07] blur-[150px]" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-[#1479e8]/[0.05] blur-[150px]" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">

        {/* COMMENT SECTION */}
<div className="py-8 sm:py-10 lg:py-12">
  <form
    onSubmit={handleCommentSubmit}
    className="mx-auto max-w-3xl"
  >
    <div
      className="
        overflow-hidden
        rounded-[22px]
        border
        border-white/10
        bg-white/[0.035]
        shadow-xl
        shadow-black
        transition-all
        duration-300
        focus-within:border-[#1479e8]/50
        focus-within:bg-white/[0.045]
      "
    >
      {/* Comment */}
      <textarea
        value={comment}
        onChange={(event) => {
          setComment(event.target.value);
          setMessage("");
        }}
        placeholder="Share your thoughts..."
        rows={3}
        maxLength={1000}
        className="
          block
          w-full
          resize-none
          border-0
          bg-transparent
          px-5
          pt-4
          text-sm
          font-medium
          leading-6
          text-white
          outline-none
          placeholder:text-white/25
          sm:px-6
          sm:pt-5
        "
      />

      {/* Bottom controls */}
      <div className="flex items-center justify-between gap-4 px-4 pb-4 pt-2 sm:px-5 sm:pb-5">

        <span className="text-[11px] font-medium text-white/20">
          {comment.length}/1000
        </span>

        <button
          type="submit"
          disabled={submitting}
          className="
            group
            inline-flex
            items-center
            gap-2.5
            rounded-full
            bg-[#1479e8]
            px-5
            py-2.5
            text-xs
            font-bold
            text-white
            transition-all
            duration-300
            hover:bg-[#2186f0]
            hover:shadow-lg
            hover:shadow-[#1479e8]/20
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <span>
            {submitting ? "Sending..." : "Send"}
          </span>

          <Send
            size={14}
            strokeWidth={2}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>
    </div>

    {message && (
      <p className="mt-3 text-center text-xs font-medium text-white/45">
        {message}
      </p>
    )}
  </form>
</div>

        {/* COPYRIGHT */}
        <div className="border-t border-white/10 py-7">
          <p className="text-center text-xs font-medium tracking-wide text-white/35 sm:text-sm">
            © {new Date().getFullYear()} Digital Wisdom Advertising and Promotion. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}