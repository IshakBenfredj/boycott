import Swal from "sweetalert2";

async function isSure(message, icon = "warning", iconHtml = "!") {
  const result = await  Swal.fire({
    title: message,
    icon: icon,
    iconHtml: iconHtml,
    confirmButtonText: "نعم",
    cancelButtonText: "إلغاء",
    showCancelButton: true,
    showCloseButton: true,
  });
  return result.isConfirmed;
}

export default isSure;
