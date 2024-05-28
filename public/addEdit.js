import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showJobs } from "./jobs.js";

const addEditDiv = document.getElementById("edit-job");
const company = document.getElementById("company");
const position = document.getElementById("position");
const status = document.getElementById("status");
const addingJob = document.getElementById("adding-job");

const form = document.querySelector("#addEditJobForm");

export const handleAddEdit = () => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // this return will prevent the code below from running!
    if (!inputEnabled) {
      return;
    }
    
    // now the code below this line is no longer wrapped in a nested if/else!
    enableInput(false);

  let method = "POST";
  let url = "/api/v1/jobs";
  console.log(addingJob.dataset);
  if (addingJob.textContent === "update") {
    method = "PATCH";
    url = `/api/v1/jobs/${addEditDiv.dataset.id}`;
  }
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company: company.value,
          position: position.value,
          status: status.value,
        }),
      });
      if (!response.ok) {
        // grab error from server and throw it!
        const { error } = await response.json();
        throw new Error(error);
      }

      message.textContent = `The job entry was ${addingJob.dataset.action === "update" ? "updated" : "created"}`;

      const addEditForm = document.querySelector("#add-edit-form");
      if (addEditForm) {
        addEditForm.reset();
      } else {
        company.value = "";
        position.value = "";
        status.value = "pending";
      }

      showJobs();
    } catch (err) {
      console.error(err);
      //catch and use the server response error to communicate to the user what went wrong!!!
      message.textContent = err?.message || "A communication error occurred.";
    }

    enableInput(true);
  });
};

export const showAddEdit = async (jobId) => {
  if (!jobId) {
    company.value = "";
    position.value = "";
    status.value = "pending";
    addingJob.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/jobs/${jobId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
        if (response.ok) {
          company.value = data.job.company;
          position.value = data.job.position;
          status.value = data.job.status;
          addingJob.textContent = "update";
          message.textContent = "";
          addEditDiv.dataset.id = jobId;

          setDiv(addEditDiv);
        } else {
        // might happen if the list has been updated since last display
        message.textContent = "The jobs entry was not found";
        showJobs();
        }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showJobs();
    }

    enableInput(true);
  }
};

export const showDelete = async (jobId) => {
  enableInput(false);
  try {
    const response = await fetch(`/api/v1/jobs/${jobId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.status === 200) {
      message.textContent = "The job entry was successfully deleted.";
      showJobs();
    } else {
      // might happen if the list has been updated since last display
      message.textContent = "The jobs entry was not found";
      showJobs();
    }
  } catch (err) {
    console.log(err);
    message.textContent = err.message || "A communications error has occurred.";
    showJobs();
  }
  enableInput(true);
};
