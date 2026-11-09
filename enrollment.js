(() => {
  const form = document.querySelector("#enrollment-form");
  const catalog = window.YHatOfferings;
  if (!form || !catalog) return;

  const programSelect = form.elements.programChoice;
  const offerPreview = document.querySelector("#offer-preview");
  const formStatus = document.querySelector("#form-status");
  const submitButton = form.querySelector('button[type="submit"]');
  const staticEmailMode = window.location.protocol === "file:"
    || window.location.hostname.endsWith(".github.io");
  const fees = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: catalog.currency,
    maximumFractionDigits: 0
  });

  const courseGroup = document.createElement("optgroup");
  courseGroup.label = "Individual programs";
  for (const course of catalog.courses) {
    const option = document.createElement("option");
    option.value = `course:${course.id}`;
    option.textContent = course.name;
    courseGroup.append(option);
  }
  programSelect.append(courseGroup);

  const bundleGroup = document.createElement("optgroup");
  bundleGroup.label = "Multi-course bundles";
  for (const bundle of catalog.bundles) {
    const option = document.createElement("option");
    option.value = `bundle:${bundle.id}`;
    option.textContent = `${bundle.name} (${bundle.priceLabel})`;
    bundleGroup.append(option);
  }
  programSelect.append(bundleGroup);

  const requestedCourse = new URLSearchParams(window.location.search).get("course");
  if (catalog.courses.some((course) => course.id === requestedCourse)) {
    programSelect.value = `course:${requestedCourse}`;
  }
  const requestedBundle = new URLSearchParams(window.location.search).get("bundle");
  if (catalog.bundles.some((bundle) => bundle.id === requestedBundle)) {
    programSelect.value = `bundle:${requestedBundle}`;
  }

  function showOffer() {
    const [type, id] = programSelect.value.split(":");
    const course = type === "course" ? catalog.courses.find((item) => item.id === id) : null;
    const bundle = type === "bundle" ? catalog.bundles.find((item) => item.id === id) : null;
    if (course) {
      offerPreview.textContent = `${course.duration}; ${course.liveHours} of live instruction. Founding Cohort ${fees.format(course.launchPrice)}; regular price ${fees.format(course.regularPrice)}.`;
      return;
    }
    if (bundle) {
      offerPreview.textContent = `${bundle.name} bundle price ${bundle.priceLabel}. Includes ${bundle.courseIds.map((courseId) => catalog.courses.find((item) => item.id === courseId)?.name).filter(Boolean).join(", ")}.`;
      return;
    }
    offerPreview.textContent = "Choose a program or bundle to see pricing details.";
  }

  programSelect.addEventListener("change", showOffer);
  showOffer();

  async function checkRequestStatus() {
    if (staticEmailMode) {
      formStatus.textContent = "This public site sends enquiries through your email app; it does not store them.";
      return;
    }
    try {
      const response = await fetch("/api/status", { cache: "no-store" });
      if (!response.ok) throw new Error("Status unavailable");
      const status = await response.json();
      if (!status.acceptingRequests) {
        submitButton.disabled = true;
        formStatus.textContent = "Online enrollment is not open yet. Email or call us to ask about upcoming cohorts.";
      }
    } catch {
      if (window.location.protocol !== "file:") {
        submitButton.disabled = true;
        formStatus.textContent = "We could not verify enrollment availability. Please email or call us directly.";
      }
    }
  }

  if (window.location.protocol !== "file:") void checkRequestStatus();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    submitButton.disabled = true;
    formStatus.textContent = "Sending your request...";

    const [selectionType, selectionId] = programSelect.value.split(":");
    const payload = {
      fullName: form.elements.fullName.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      ...(selectionType === "course" ? { courseId: selectionId } : { bundleId: selectionId }),
      cohortPreference: form.elements.cohortPreference.value,
      experience: form.elements.experience.value,
      goals: form.elements.goals.value.trim(),
      consent: form.elements.consent.checked,
      companyWebsite: form.elements.companyWebsite.value,
      privacyNoticeVersion: "privacy-notice-v4"
    };

    if (staticEmailMode) {
      const selectedCourse = catalog.courses.find((course) => course.id === selectionId);
      const selectedBundle = catalog.bundles.find((bundle) => bundle.id === selectionId);
      const selectedOffer = selectionType === "course" ? selectedCourse : selectedBundle;
      const emailBody = [
        "Y-Hat Analytics course enquiry",
        "",
        `Name: ${payload.fullName}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone}`,
        `Program: ${selectedOffer?.name || "Not selected"}`,
        `Preferred class time: ${payload.cohortPreference}`,
        `Current experience: ${payload.experience}`,
        `Learning goals: ${payload.goals || "Not provided"}`,
        "",
        "I have read the privacy notice and draft terms and consent to using these details to respond to my course request."
      ].join("\n");
      const subject = `Course enquiry: ${selectedOffer?.name || "Y-Hat Analytics"}`;
      const mailto = `mailto:yhatanalytics03@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
      formStatus.textContent = "Your email app should open with this enquiry. Review the message and send it there; the website does not save it.";
      window.location.href = mailto;
      submitButton.disabled = false;
      return;
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      let result;
      try {
        result = await response.json();
      } catch {
        throw new Error("The enrollment service is unavailable. Please try again later or email us directly.");
      }
      if (!response.ok) throw new Error(result.message || "The request could not be sent.");

      formStatus.textContent = result.storage === "memory"
        ? "Request received in local preview only; it will be removed when this server stops."
        : "Request received. We will contact you about the cohort and final offer.";
      form.reset();
      showOffer();
    } catch (error) {
      formStatus.textContent = error instanceof TypeError
        ? "We could not reach the enrollment service. Please try again later or email us directly."
        : error.message;
    } finally {
      submitButton.disabled = false;
    }
  });
})();