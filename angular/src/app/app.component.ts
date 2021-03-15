import { Component } from '@angular/core';
import { Employee, EmployeesService } from './employees.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Getting Started with Treelist';
  employees: Employee[] = [];
  selectedEmployee: Employee;

  constructor(service: EmployeesService) {
    this.employees = service.getEmployees();
    this.selectEmployee = this.selectEmployee.bind(this);
  }

  selectEmployee(e) {
    e.component.byKey(e.currentSelectedRowKeys[0]).done(employee => {
      if(employee) {
        this.selectedEmployee = employee;
      }
    });
  }

  onDragChange(e) {
    let visibleRows = e.component.getVisibleRows(),
        sourceNode = e.component.getNodeByKey(e.itemData.ID),
        targetNode = visibleRows[e.toIndex].node;

    while(targetNode && targetNode.data) {
        if (targetNode.data.ID === sourceNode.data.ID) {
            e.cancel = true;
            break;
        }
        targetNode = targetNode.parent;
    }
  }

  onReorder(e) {
    let visibleRows =  e.component.getVisibleRows();
    let sourceData = e.itemData;
    let  targetData = visibleRows[e.toIndex].data;

    if (e.dropInsideItem) {
      e.itemData.Head_ID = targetData.ID;
      e.component.refresh();
    } else {
      let sourceIndex = this.employees.indexOf(sourceData);
      let targetIndex = this.employees.indexOf(targetData);

      if (sourceData.Head_ID !== targetData.Head_ID) {
          sourceData.Head_ID = targetData.Head_ID;
          if (e.toIndex > e.fromIndex) {
              targetIndex++;
          }
      }

      this.employees.splice(sourceIndex, 1);
      this.employees.splice(targetIndex, 0, sourceData);
    }
  }

}
