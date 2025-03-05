import Swal from "sweetalert2";

export const showSuccessAlert = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonColor: "#3085d6",
    confirmButtonText: "OK",
  });
};

export const showErrorAlert = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonColor: "#d33",
    confirmButtonText: "OK",
  });
};

export const showConfirmationAlert = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, confirm!",
    cancelButtonText: "Cancel",
  }).then((result) => result.isConfirmed);
};
