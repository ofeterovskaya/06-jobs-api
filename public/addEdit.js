import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showJobs } from "./jobs.js";

// let addEditDiv = null;
// let company = null;
// let position = null;
// let status = null;
// let addingJob = null;
const addEditDiv = document.getElementById("edit-job");
const company = document.getElementById("company");
const position = document.getElementById("position");
const status = document.getElementById("status");
const addingJob = document.getElementById("adding-job");

export const handleAddEdit = () => {
  addEditDiv.addEventListener("click", async (e) => {
    if ((!inputEnabled && e.target.nodeName !== "BUTTON") || e.target !== addingJob) {
      // this return will prevent the code below from running!
      return;
    }
    
    // now the code below this line is no longer wrapped in a nested if/else!
    enableInput(false);

  let method = "POST";
  let url = "/api/v1/jobs";

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

      const data = await response.json();
        if (response.status === 200 || response.status === 201) {
          if (response.status === 200) {
        // a 200 is expected for a successful update
            message.textContent = "The job entry was updated.";
          } else {
        // a 201 is expected for a successful create
              message.textContent = "The job entry was created.";
          }

      company.value = "";
      position.value = "";
      status.value = "pending";

      showJobs();
        } else {
            message.textContent = data.msg;
        }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
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
      if (response.status === 200) {
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
    message.textContent = "A communications error has occurred.";
    showJobs();
  }
  enableInput(true);
};
