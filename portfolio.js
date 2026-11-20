"use strict";

const dialog = document.getElementById("project-dialog");
const detail = document.getElementById("project-detail");
let previousFocus = null;

function renderProject(project) {
  detail.replaceChildren();
  const header = document.createElement("header");
  header.className = "detail-header";
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = project.type;
  const title = document.createElement("h2");
  title.id = "detail-title";
  title.textContent = project.title;
  const summary = document.createElement("p");
  summary.textContent = project.summary;
  const meta = document.createElement("div");
  meta.className = "detail-meta";
  meta.textContent = project.tools.join(" · ");
  header.append(eyebrow, title, summary, meta);

  const gallery = document.createElement("div");
  gallery.className = "detail-gallery";
  const frame = document.createElement("div");
  frame.className = "gallery-frame";
  const image = document.createElement("img");
  image.width = 1280;
  image.height = 720;
  frame.append(image);
  const caption = document.createElement("p");
  caption.className = "gallery-caption";
  caption.setAttribute("aria-live", "polite");
  gallery.append(frame, caption);
  const thumbs = document.createElement("div");
  thumbs.className = "gallery-thumbs";
  thumbs.setAttribute("aria-label", "Project screenshots");
  const buttons = project.images.map((screenshot, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = screenshot.label;
    button.setAttribute("aria-pressed", String(index === 0));
    button.addEventListener("click", () => showImage(index));
    thumbs.append(button);
    return button;
  });
  function showImage(index) {
    const screenshot = project.images[index];
    image.src = screenshot.src;
    image.alt = screenshot.alt;
    caption.textContent = screenshot.caption;
    buttons.forEach((button, buttonIndex) =>
      button.setAttribute("aria-pressed", String(buttonIndex === index)),
    );
  }
  if (project.images.length) showImage(0);
  if (buttons.length > 1) gallery.append(thumbs);

  const copy = document.createElement("div");
  copy.className = "detail-copy";
  const features = document.createElement("section");
  const heading = document.createElement("h3");
  heading.textContent = project.heading;
  const list = document.createElement("ul");
  for (const text of project.details) {
    const item = document.createElement("li");
    item.textContent = text;
    list.append(item);
  }
  features.append(heading, list);
  const side = document.createElement("aside");
  side.className = "detail-side";
  const roleLabel = document.createElement("p");
  roleLabel.className = "eyebrow";
  roleLabel.textContent = "My role";
  const role = document.createElement("h3");
  role.textContent = project.role;
  const focus = document.createElement("p");
  focus.textContent = project.focus;
  const repo = document.createElement("a");
  repo.className = "button";
  repo.href = project.repo;
  repo.target = "_blank";
  repo.rel = "noopener";
  repo.textContent = project.repoLabel;
  side.append(roleLabel, role, focus, repo);
  if (project.repoNote) {
    const note = document.createElement("p");
    note.className = "repository-note";
    note.textContent = project.repoNote;
    side.append(note);
  }
  if (project.credit) {
    const credit = document.createElement("a");
    credit.className = "image-credit";
    credit.href = project.credit;
    credit.target = "_blank";
    credit.rel = "noopener";
    credit.textContent =
      project.creditLabel || "Team screenshots · Khoo Kah Qin";
    side.append(credit);
  }
  copy.append(features, side);
  detail.append(header);
  if (project.images.length) detail.append(gallery);
  detail.append(copy);
}

function openProject(id, updateUrl = true) {
  if (!Object.hasOwn(window.portfolioProjects, id)) return;
  const project = window.portfolioProjects[id];
  previousFocus = document.activeElement;
  renderProject(project);
  if (!dialog.open) dialog.showModal();
  document.body.classList.add("dialog-open");
  dialog.scrollTop = 0;
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set("project", id);
    history.pushState({ project: id }, "", url);
  }
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-project]");
  if (
    !link ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  event.preventDefault();
  openProject(link.dataset.project);
});

document
  .querySelector(".close-dialog")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom
  )
    dialog.close();
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  const url = new URL(window.location.href);
  if (url.searchParams.has("project")) {
    url.searchParams.delete("project");
    history.replaceState(null, "", url);
  }
  if (previousFocus instanceof HTMLElement && previousFocus.isConnected)
    previousFocus.focus({ preventScroll: true });
});
window.addEventListener("popstate", () => {
  const id = new URL(window.location.href).searchParams.get("project");
  if (Object.hasOwn(window.portfolioProjects, id)) openProject(id, false);
  else if (dialog.open) dialog.close();
});
const initialProject = new URL(window.location.href).searchParams.get(
  "project",
);
if (initialProject) openProject(initialProject, false);
