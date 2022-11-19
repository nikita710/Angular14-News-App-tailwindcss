import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NewsService } from './service/news.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'latest-news-app';
  @ViewChild(MatSidenav) sideNav!: MatSidenav;

  public sources: any = [];
  public articles: any = [];
  public selectedNewsChannel: string = 'Top 10 Trending News!';

  constructor(
    private observer: BreakpointObserver,
    private cd: ChangeDetectorRef,
    private newsApi: NewsService
  ) {}

  ngOnInit(): void {
    this.newsApi.initArticles().subscribe((res: any) => {
      console.log(res);
      this.articles = res.articles;
    });

    this.newsApi.initSources().subscribe((res: any) => {
      console.log(res);
      this.sources = res.sources;
    });
  }

  ngAfterViewInit(): void {
    this.sideNav.opened = true;
    this.observer.observe(['(max-width:800px)']).subscribe((res) => {
      if (res?.matches) {
        this.sideNav.mode = 'over';
        this.sideNav.close();
      } else {
        this.sideNav.mode = 'side';
        this.sideNav.open();
      }
    });
    this.cd.detectChanges();
  }

  searchSource(source: any) {
    this.newsApi.getArticlesByID(source.id).subscribe((res: any) => {
      this.articles = res.articles;
      this.selectedNewsChannel = source.name;
    });
  }
}
