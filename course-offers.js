(() => {
  const catalog = window.YHatOfferings;
  if (!catalog) return;

  const fees = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: catalog.currency,
    maximumFractionDigits: 0
  });

  document.querySelectorAll(".program-card[href]").forEach((card) => {
    const href = card.getAttribute("href").split("#")[0];
    const courseId = href.slice(href.lastIndexOf("/") + 1).replace(/\.html$/, "");
    const course = catalog.courses.find((item) => item.id === courseId);
    const textLink = card.querySelector(".text-link");
    if (!course || !textLink) return;

    const offer = document.createElement("span");
    offer.className = "program-offer";
    offer.textContent = `${course.duration}  |  ${course.liveHours}  |  Founding ${fees.format(course.launchPrice)}  |  Regular ${fees.format(course.regularPrice)}`;
    card.insertBefore(offer, textLink);
  });

  document.querySelectorAll("[data-bundle-grid]").forEach((grid) => {
    for (const bundle of catalog.bundles) {
      const card = document.createElement("a");
      card.className = "program-card bundle-card";
      card.href = `contact.html?bundle=${encodeURIComponent(bundle.id)}`;

      const label = document.createElement("span");
      label.className = "program-number";
      label.textContent = "LEARNING TRACK";

      const heading = document.createElement("h3");
      heading.textContent = bundle.name;

      const included = document.createElement("p");
      included.textContent = bundle.courseIds
        .map((id) => catalog.courses.find((course) => course.id === id)?.name)
        .filter(Boolean)
        .join(" + ");

      const price = document.createElement("span");
      price.className = "program-offer";
      price.textContent = `Bundle price ${bundle.priceLabel}`;

      const link = document.createElement("span");
      link.className = "text-link";
      link.textContent = "Enquire about this track";

      card.append(label, heading, included, price, link);
      grid.append(card);
    }
  });

  document.querySelectorAll("[data-course-offer]").forEach((container) => {
    const course = catalog.courses.find((item) => item.id === container.dataset.courseOffer);
    if (!course) return;

    const heading = document.createElement("h2");
    heading.textContent = "Founding Cohort offer";
    container.append(heading);

    const details = document.createElement("dl");
    details.className = "course-offer-facts";
    const facts = [
      ["Duration", course.duration],
      ["Live instruction", course.liveHours],
      ["Founding Cohort", fees.format(course.launchPrice)],
      ["Regular price", fees.format(course.regularPrice)],
      ["Delivery", catalog.delivery],
      ["Live classes", catalog.weeklySchedule],
      ["Practice and support", catalog.learnerSupport],
      ["Next cohort", catalog.cohortStart]
    ];

    for (const [label, value] of facts) {
      const item = document.createElement("div");
      const term = document.createElement("dt");
      const description = document.createElement("dd");
      term.textContent = label;
      description.textContent = value;
      item.append(term, description);
      details.append(item);
    }

    container.append(details);
    const note = document.createElement("p");
    note.className = "program-note";
    note.textContent = `${catalog.status}. ${catalog.tuitionNote}`;
    container.append(note);
  });
})();