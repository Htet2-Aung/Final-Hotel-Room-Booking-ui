//Datatable Modules
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import $ from "jquery";

// Shared pretty DataTable initializer (pagination + page-length + search)
export const initPrettyDataTable = (selector = "#example", delay = 500, heading = null, order = [[0, "desc"]]) => {
  // IMPORTANT: call from useLayoutEffect and return the cleanup, e.g.
  //   useLayoutEffect(() => initPrettyDataTable(...), []);
  // The cleanup destroys the DataTable BEFORE React unmounts the table DOM,
  // otherwise DataTables' wrapper breaks React's removeChild (NotFoundError).
  const timer = setTimeout(function () {
      if (!$(selector).length) {
        return;
      }
      if ($.fn.DataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
      }
      $(selector).DataTable({
        // layout: search box on top; "Show entries" + info + pagination below the table
        dom:
          '<"row align-items-center mb-2"<"col-md-6 pt-headcell"><"col-md-6 d-flex justify-content-end"f>>' +
          "rt" +
          '<"row align-items-center mt-3 dt-footer"<"col-sm-12 col-md-4"l><"col-sm-12 col-md-4 text-center"i><"col-sm-12 col-md-4 d-flex justify-content-center justify-content-md-end"p>>',
        // initial sort (default: newest records first; overridable per table)
        order: order,
        // "No" column always reads 1,2,3... in the current display order,
        // renumbered on every sort / search / page change
        drawCallback: function (settings) {
          const api = new $.fn.dataTable.Api(settings);
          const start = api.page.info().start;
          api
            .column(0, { order: "current", search: "applied", page: "current" })
            .nodes()
            .each(function (cell, i) {
              cell.innerHTML = start + i + 1;
            });
        },
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50, 100],
        language: {
          search: "_INPUT_",
          searchPlaceholder: "Search records...",
          lengthMenu: "Show _MENU_ entries",
          info: "Showing _START_ to _END_ of _TOTAL_ entries",
          infoEmpty: "No entries to show",
          zeroRecords: "No matching records found",
          paginate: {
            previous: "\u2039 Previous",
            next: "Next \u203A",
          },
        },
        // optional table title/description rendered left of the search box
        initComplete: function () {
          if (heading && heading.title) {
            const headingHtml =
              '<div class="pt-heading">' +
              '<span class="pt-title">' + heading.title + "</span>" +
              (heading.subtitle
                ? '<span class="pt-subtitle">' + heading.subtitle + "</span>"
                : "") +
              "</div>";
            $(selector + "_wrapper").find(".pt-headcell").html(headingHtml);
          }
        },
      });
    }, delay);

  // cleanup: put the table DOM back exactly as React rendered it,
  // so React can unmount/update it without a NotFoundError
  return () => {
    clearTimeout(timer);
    try {
      if ($.fn.DataTable.isDataTable(selector)) {
        $(selector).DataTable().destroy();
      }
    } catch (e) {
      // table already removed from the DOM - nothing to restore
    }
  };
};
