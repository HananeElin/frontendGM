import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-organisation',
  standalone: true,
  imports: [],
  templateUrl: './organisation.component.html',
  styleUrl: './organisation.component.css'
})
export class OrganisationComponent implements OnInit {dataPreview: any[] = [];
  columns: any[] = [];
  isDeleting: boolean = false;
  isTesting: boolean = false;
  isImporting: boolean = false;
  mappingList: { label: string; value: string }[] = [];

  constructor(private toastr: ToastrService) { }

  ngOnInit() {
    this.loadData();
    this.initializeMappingList();
  }

  loadData() {
    setTimeout(() => {
      this.dataPreview = this.generateData(30);
      this.columns = this.getColumns();
    }, 2000);
  }

  initializeMappingList() {
    this.mappingList = [
      { label: 'Field A', value: 'FieldA' },
      { label: 'Field B', value: 'FieldB' },
      { label: 'Field C', value: 'FieldC' },
      { label: 'Field D', value: 'FieldD' }
    ];
  }

  generateData(count: number) {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        id: i + 1,
        label: `Label-${i + 1}`,
        company: `Company-${i + 1}`,
        product: `Product-${i + 1}`,
        description: `Description for Product-${i + 1}`,
        status: i % 2 === 0 ? 'Active' : 'Inactive',
        price: (Math.random() * 100).toFixed(2)
      });
    }
    return data;
  }

  getColumns() {
    return [
      { id: 'label', label: 'label' },
      { id: 'company', label: 'Company Name' },
      { id: 'product', label: 'Product Name' },
      { id: 'description', label: 'Extremely long Product Description' },
      { id: 'status', label: 'Status' },
      { id: 'price', label: 'Price ($)' }
    ];
  }

  deleteData() {
    this.isDeleting = true;
    setTimeout(() => {
      this.isDeleting = false;
      this.toastr.success('Action successfully deleted.');
    }, 1500);
  }

  importTest() {
    this.isTesting = true;
    setTimeout(() => {
      this.isTesting = false;
      this.toastr.success('Test successfully completed.');
    }, 1500);
  }

  importData() {
    this.isImporting = true;
    setTimeout(() => {
      this.isImporting = false;
      this.toastr.success('Data successfully imported.');
    }, 1500);
  }

}
