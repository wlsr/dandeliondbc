import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-index',
  templateUrl: './cliente-index.component.html',
  styleUrls: ['./cliente-index.component.css']
})

export class ClienteIndexComponent implements OnInit {
  public clientes;
  public filtro;
  public empresaDate;
  public data_detalle: Array<any> = [];
  public estado = "";
  public data: any;
  constructor(
    private _clienteService: ClienteService,

    private _router: Router
  ) {

  }
  ngOnInit() {
    this._clienteService.getClientes().subscribe(
      response => {
        this.clientes = response.clientes;
      },
      error => {

      }
    )
  }
  // searchByDate(searchForms) {

  //   this._empresaService.getEmpresabyDate(this.empresaDate).subscribe(
  //     response => {
  //       this.empresas = response.result;
  //       console.log('devuelve:', this.empresas)
  //     },
  //     error => {
  //     }
  //   );
  // }
  // searchEstado(searchEstadoForm) {
  //   console.log('Estado :', searchEstadoForm.value.filtroEstado)

  //   this._empresaService.getEmpresaByState(searchEstadoForm.value.filtroEstado).subscribe(
  //     response => {
  //       this.empresas = response.empresas;
  //       console.log('devuelve:', this.empresas)
  //     },
  //     error => {
  //     }
  //   );
  // }
  searchCliente(searchClienteForm) {    
    this._clienteService.get_clientes(searchClienteForm.value.filtroCliente).subscribe(
      response => {
        this.clientes = response.clientes;
      },
      error => {
      }
    )
  }
  listar() {
    this._clienteService.getClientes().subscribe(
      response => {
        this.clientes = response.clientes;
      },
      error => {
      }
    )
  }
  eliminar(id) {
    Swal.fire({
      title: 'Estas seguro de eliminarlo?',
      text: "Eliminación!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Registro eliminado!',
          'Se elimino correctamente.',
          'success'
        )

        this._clienteService.deleteCliente(id).subscribe(
          resposen => {
            this._clienteService.getClientes().subscribe(
              response => {
                this.clientes = response.clientes;
              },
              error => {

              }
            );
          },
          erro => {

          }
        );

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelado',
          'Se cancelo la solicitud :)',
          'error'
        )
      }
    })
  }

}

