import SongItem from '@/components/SongItem.vue';
import { shallowMount, RouterLinkStub } from '@vue/test-utils';

describe('SongItem.vue', () => {
    test('render song.displayName', () => {
        const song = {
            displayName: 'test'
        }
        
        const wrapper = shallowMount(SongItem, {
            props: {
                song,
            },
            global: {
                components: {
                    'router-link': RouterLinkStub
                }
            }
        });

        const compositionAuthor = wrapper.find('.text-gray-500')

        expect(compositionAuthor.text()).toBe(song.displayName)
    });
});