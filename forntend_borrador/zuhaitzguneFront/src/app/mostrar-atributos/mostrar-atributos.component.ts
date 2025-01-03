// muestra los atributos de un arbol una vez se pincha en el componente map-geoserver-id
// en este caso los datos se comparten con el servicio atributo-service
// Se pincha en el mapa y se coge el atributo id que permite coger los datos de la BBDD
// se genera un observable en este componente al que se suscribe para obtener los valores
// finalmente se muestran en un html
import { Component, OnInit , OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtributoService } from '../servicio/atributo.service';
import { WfsService } from '../servicio/wfs.service';
import { HttpClientModule } from '@angular/common/http';
import { Task } from '../modelo/task.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-mostrar-atributos',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [WfsService],
  templateUrl: './mostrar-atributos.component.html',
  styleUrl: './mostrar-atributos.component.css'
})
export class MostrarAtributosComponent implements OnInit, OnDestroy {
  attributes: any = null;
  attributeKeys: string[] = [];
  isEditMode: boolean = false; // Variable para el modo de edición
  private _id!:number;
  private unsubscribe$ = new Subject<void>();
  constructor(
      private attributeService: AtributoService,
      private datosArbol: AtributoService,
      private wfsService: WfsService,
      private router:Router,
      private editMode: AtributoService,
      private idArbol: AtributoService

  ) {}

  ngOnInit(): void {
    //genero el observable y me suscribo para obteenr el id 
    this.attributeService.atributos
      .pipe(takeUntil(this.unsubscribe$)) // Cancela la suscripción en OnDestroy
      .subscribe({
        next: data => {
          console.log("dato",data.id);
          this._id= data.id;
          //genero otro obervable para obtener los datos de la BBDD con el dato (id) obtenido de la otra subscripcion
          this.wfsService.getFeaturesId(this._id)
            .pipe(takeUntil(this.unsubscribe$)) // Cancela esta suscripción también en OnDestroy
            .subscribe({
              next: response => {
                console.log('Árbol mostrado correctamente', response);
                this.attributes = response;
                // obtengo un array con las claves de los atributos
                this.attributeKeys = response ? Object.keys(response) : [];
                // Verifica si tasks es un array y extrae datos detallados si es necesario
                if (Array.isArray(this.attributes.tasks)) {
                  this.attributes.tasks = this.attributes.tasks.map((task:Task) => ({
                    ...task, // Muestra todos los campos del objeto `task`
                  }));
                };
                
              },
              error: err => console.error("Error al obtener los atributos:", err)
          });
        },
        error: err => console.error("Error en el servicio de atributos:", err)
      });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
          this.idArbol.setId(this._id);
          this.editMode.setEditMode(true);
          this.datosArbol.updateAttributes(this.attributes);
          console.log('datos formualrio',this.attributes);
          this.router.navigate(['/formulario-definitivo']);   
    }
}
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
