import React from "react";
import dynamic from "next/dynamic";
import type { NextPage } from "next";
import Head from "next/head";

// ================= ANT DESIGN (DYNAMIC IMPORTS) =================

const AntdForm = dynamic(
  () => import("antd").then((mod) => mod.Form),
  { ssr: false }
);

const AntdInput = dynamic(
  () => import("antd").then((mod) => mod.Input),
  { ssr: false }
);

const AntdTextArea = dynamic(
  () => import("antd").then((mod) => mod.Input.TextArea),
  { ssr: false }
);

const AntdButton = dynamic(
  () => import("antd").then((mod) => mod.Button),
  { ssr: false }
);

// ================= PAGE =================

const ApplyToACommunity: NextPage = () => {
  return (
    <>
      <Head>
        <title>Apply to a Community</title>
      </Head>

      <main
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          padding: "48px 16px",
          boxSizing: "border-box",
        }}
      >
        {/* PAGE_CONTAINER */}
        <div
          id="page_container"
          style={{
            width: "100%",
            maxWidth: 1064,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* FORM_CARD */}
          <div
            id="form_card"
            style={{
              width: "100%",
              background: "#ffffff",
              borderRadius: 12,
              padding: 40,
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            {/* HEADER_NODE */}
            <div
              id="header_node"
              style={{
                marginBottom: 32,
              }}
            >
              <h1
                id="title_node"
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                Apply to a Community
              </h1>

              <p
                id="subtitle_node"
                style={{
                  fontSize: 16,
                  color: "#666",
                }}
              >
                Tell us why you want to join this community.
              </p>
            </div>

            {/* FORM_NODE */}
            <AntdForm
              id="apply_form"
              layout="vertical"
            >
              {/* NAME_FIELD_NODE */}
              <AntdForm.Item
                id="name_field_node"
                label="Full Name"
                name="full_name"
                rules={[{ required: true }]}
              >
                <AntdInput
                  id="full_name_input"
                  placeholder="Your full name"
                />
              </AntdForm.Item>

              {/* EMAIL_FIELD_NODE */}
              <AntdForm.Item
                id="email_field_node"
                label="Email"
                name="email"
                rules={[{ required: true, type: "email" }]}
              >
                <AntdInput
                  id="email_input"
                  placeholder="your@email.com"
                />
              </AntdForm.Item>

              {/* MESSAGE_FIELD_NODE */}
              <AntdForm.Item
                id="message_field_node"
                label="Why do you want to join?"
                name="message"
                rules={[{ required: true }]}
              >
                <AntdTextArea
                  id="message_textarea"
                  rows={5}
                  placeholder="Explain your motivation"
                />
              </AntdForm.Item>

              {/* ACTIONS_NODE */}
              <div
                id="actions_node"
                style={{
                  marginTop: 32,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <AntdButton
                  id="submit_button"
                  type="primary"
                  htmlType="submit"
                  size="large"
                >
                  Submit Application
                </AntdButton>
              </div>
            </AntdForm>
          </div>
        </div>
      </main>
    </>
  );
};

export default ApplyToACommunity;
